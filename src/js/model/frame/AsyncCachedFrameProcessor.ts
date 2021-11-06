module pskl {
    export module model {
        export module frame {

            export class AsyncCachedFrameProcessor extends CachedFrameProcessor {
                constructor(cacheResetInterval) {
                    super();
                }
                get(frame, namespace) {
                    var processedFrame = null;
                    namespace = namespace || this.defaultNamespace;

                    if (!this.cache_[namespace]) {
                        this.cache_[namespace] = {};
                    }

                    var deferred = Q.defer();

                    var cache = this.cache_[namespace];

                    var key1 = frame.getHash();
                    if (cache[key1]) {
                        processedFrame = cache[key1];
                    } else {
                        var callback = this.onProcessorComplete_.bind(this, deferred, cache, key1);
                        this.frameProcessor(frame, callback);
                    }

                    if (processedFrame) {
                        deferred.resolve(processedFrame);
                    }

                    return deferred.promise;
                };

                onProcessorComplete_(deferred, cache, key1, result) {
                    cache[key1] = result;
                    deferred.resolve(result);
                };
            }
        }
    }
}