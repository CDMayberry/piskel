module pskl {
    export module model {
        export module frame {
            // Maximum number of cache entries
            var MAX_CACHE_ENTRIES = 100;

            var DEFAULT_FRAME_PROCESSOR = function (frame) {
                return pskl.utils.FrameUtils.toImage(frame);
            };

            var DEFAULT_OUTPUT_CLONER = (o) => o;

            var DEFAULT_NAMESPACE = '__cache_default__';

            export class CachedFrameProcessor {
                cache_: {};
                cacheQueue_: any[];
                frameProcessor: (frame: any, callback?) => any;
                outputCloner: (o: any) => any;
                defaultNamespace: string;

                constructor() {
                    // Cache object.
                    this.cache_ = {};

                    // Array of [namespace, key] for each cached frame.
                    this.cacheQueue_ = [];

                    this.frameProcessor = DEFAULT_FRAME_PROCESSOR;
                    this.outputCloner = DEFAULT_OUTPUT_CLONER;
                    this.defaultNamespace = DEFAULT_NAMESPACE;
                }

                clear() {
                    this.cache_ = {};
                }

                /**
                 * Set the processor function that will be called when there is a cache miss
                 * Function with 1 argument : pskl.model.Frame
                 * @param {Function} frameProcessor
                 */
                setFrameProcessor(frameProcessor) {
                    this.frameProcessor = frameProcessor;
                }

                /**
                 * Set the cloner that will be called when there is a miss on the 1st level cache
                 * but a hit on the 2nd level cache.
                 * Function with 2 arguments : cached value, frame
                 * @param {Function} outputCloner
                 */
                setOutputCloner(outputCloner) {
                    this.outputCloner = outputCloner;
                }

                /**
                 * Retrieve the processed frame from the cache, in the (optional) namespace
                 * If the first level cache is empty, attempt to clone it from 2nd level cache.
                 * If second level cache is empty process the frame.
                 * @param  {pskl.model.Frame} frame
                 * @param  {String} namespace
                 * @return {Object} the processed frame
                 */
                get(frame, namespace) {
                    var processedFrame = null;
                    namespace = namespace || DEFAULT_NAMESPACE;

                    if (!this.cache_[namespace]) {
                        this.cache_[namespace] = {};
                    }

                    var cache = this.cache_[namespace];

                    var cacheKey = frame.getHash();
                    if (cache[cacheKey]) {
                        processedFrame = cache[cacheKey];
                    } else {
                        processedFrame = this.frameProcessor(frame);
                        cache[cacheKey] = processedFrame;
                        this.cacheQueue_.unshift([namespace, cacheKey]);
                        if (this.cacheQueue_.length > MAX_CACHE_ENTRIES) {
                            var oldestItem = this.cacheQueue_.pop();
                            this.cache_[oldestItem[0]][oldestItem[1]] = null;
                        }
                    }

                    return processedFrame;
                }
            }
        }
    }
}