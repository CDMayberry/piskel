/// <reference path="Constants.ts" />
/// <reference path="Events.ts" />
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="lib/pubsub.d.ts" />


module pskl {

    export declare var appEnginePiskelData_;
    export declare var appEngineToken_;

    export declare var controller;
    export declare var devtools;

    export module app {
        // TODO: I have no idea how, but even though init is using 'this' it's assigning them to these variables. Sketchy...
        export declare var shortcutService: pskl.service.keyboard.ShortcutService;
        export declare var backupService: pskl.service.BackupService;
        export declare var savedStatusService: pskl.service.SavedStatusService;
        export declare var piskelController;
        export declare var selectionManager;
        export declare var mouseStateService: pskl.service.MouseStateService;
        export declare var selectedColorsService: pskl.service.SelectedColorsService;
        export declare var penSizeService: pskl.service.pensize.PenSizeService;
        export declare var drawingController;
        export declare var paletteService: pskl.service.palette.PaletteService;
        export declare var historyService: pskl.service.HistoryService;
        export declare var paletteImportService: pskl.service.palette.PaletteImportService;
        export declare var sessionId: string;
        export declare var localStorageService: pskl.service.storage.LocalStorageService;
        export declare var desktopStorageService: pskl.service.storage.DesktopStorageService;
        export declare var fileDownloadStorageService: pskl.service.storage.FileDownloadStorageService;
        export declare var indexedDbStorageService: pskl.service.storage.IndexedDbStorageService;
        export declare var galleryStorageService: pskl.service.storage.GalleryStorageService;
        export declare var currentColorsService: pskl.service.CurrentColorsService;
        export declare var fileDropperService: pskl.service.FileDropperService;

        export function init() {
            /**
             * When started from APP Engine, appEngineToken_ (Boolean) should be set on window.pskl
             */
            this.isAppEngineVersion = !!pskl.appEngineToken_;

            // This id is used to keep track of sessions in the BackupService.
            this.sessionId = pskl.utils.Uuid.generate();

            this.shortcutService = new pskl.service.keyboard.ShortcutService();
            this.shortcutService.init();

            var size = pskl.UserSettings.get(pskl.UserSettings.DEFAULT_SIZE);
            var fps = Constants.DEFAULT.FPS;
            var descriptor = new pskl.model.piskel.Descriptor('New Piskel', '');
            var piskel = new pskl.model.Piskel(size.width, size.height, fps, descriptor);

            var layer = new pskl.model.Layer('Layer 1');
            var frame = new pskl.model.Frame(size.width, size.height);

            layer.addFrame(frame);
            piskel.addLayer(layer);

            this.corePiskelController = new pskl.controller.piskel.PiskelController(piskel);
            this.corePiskelController.init();

            this.piskelController = new pskl.controller.piskel.PublicPiskelController(this.corePiskelController);
            this.piskelController.init();

            this.paletteImportService = new pskl.service.palette.PaletteImportService();
            this.paletteImportService.init();

            this.paletteService = new pskl.service.palette.PaletteService();
            this.paletteService.addDynamicPalette(new pskl.service.palette.CurrentColorsPalette());

            this.selectedColorsService = new pskl.service.SelectedColorsService();
            this.selectedColorsService.init();

            this.mouseStateService = new pskl.service.MouseStateService();
            this.mouseStateService.init();

            this.paletteController = new pskl.controller.PaletteController();
            this.paletteController.init();

            this.currentColorsService = new pskl.service.CurrentColorsService(this.piskelController);
            this.currentColorsService.init();

            this.palettesListController = new pskl.controller.PalettesListController(this.currentColorsService);
            this.palettesListController.init();

            this.cursorCoordinatesController = new pskl.controller.CursorCoordinatesController(this.piskelController);
            this.cursorCoordinatesController.init();

            this.drawingController = new pskl.controller.DrawingController(
                this.piskelController,
                document.querySelector('#drawing-canvas-container'));
            this.drawingController.init();

            this.previewController = new pskl.controller.preview.PreviewController(
                this.piskelController,
                document.querySelector('#animated-preview-canvas-container'));
            this.previewController.init();

            this.minimapController = new pskl.controller.MinimapController(
                this.piskelController,
                this.previewController,
                this.drawingController,
                document.querySelector('.minimap-container'));
            this.minimapController.init();

            this.framesListController = new pskl.controller.FramesListController(
                this.piskelController,
                document.querySelector('#preview-list-wrapper'));
            this.framesListController.init();

            this.layersListController = new pskl.controller.LayersListController(this.piskelController);
            this.layersListController.init();

            this.settingsController = new pskl.controller.settings.SettingsController(this.piskelController);
            this.settingsController.init();

            this.dialogsController = new pskl.controller.dialogs.DialogsController(this.piskelController);
            this.dialogsController.init();

            this.toolController = new pskl.controller.ToolController();
            this.toolController.init();

            this.selectionManager = new pskl.selection.SelectionManager(this.piskelController);
            this.selectionManager.init();

            this.historyService = new pskl.service.HistoryService(this.piskelController);
            this.historyService.init();

            this.notificationController = new pskl.controller.NotificationController();
            this.notificationController.init();

            this.transformationsController = new pskl.controller.TransformationsController();
            this.transformationsController.init();

            this.progressBarController = new pskl.controller.ProgressBarController();
            this.progressBarController.init();

            this.canvasBackgroundController = new pskl.controller.CanvasBackgroundController();
            this.canvasBackgroundController.init();

            this.indexedDbStorageService = new pskl.service.storage.IndexedDbStorageService(this.piskelController);
            this.indexedDbStorageService.init();

            this.localStorageService = new pskl.service.storage.LocalStorageService(this.piskelController);
            this.localStorageService.init();

            this.fileDownloadStorageService = new pskl.service.storage.FileDownloadStorageService(this.piskelController);
            this.fileDownloadStorageService.init();

            this.desktopStorageService = new pskl.service.storage.DesktopStorageService(this.piskelController);
            this.desktopStorageService.init();

            this.galleryStorageService = new pskl.service.storage.GalleryStorageService(this.piskelController);
            this.galleryStorageService.init();

            this.storageService = new pskl.service.storage.StorageService(this.piskelController);
            this.storageService.init();

            this.importService = new pskl.service.ImportService(this.piskelController);
            this.importService.init();

            this.imageUploadService = new pskl.service.ImageUploadService();
            this.imageUploadService.init();

            this.savedStatusService = new pskl.service.SavedStatusService(
                this.piskelController,
                this.historyService);
            this.savedStatusService.init();

            this.backupService = new pskl.service.BackupService(this.piskelController);
            this.backupService.init();

            this.beforeUnloadService = new pskl.service.BeforeUnloadService(this.piskelController);
            this.beforeUnloadService.init();

            this.headerController = new pskl.controller.HeaderController(
                this.piskelController,
                this.savedStatusService);
            this.headerController.init();

            this.penSizeService = new pskl.service.pensize.PenSizeService();
            this.penSizeService.init();

            this.penSizeController = new pskl.controller.PenSizeController();
            this.penSizeController.init();

            this.fileDropperService = new pskl.service.FileDropperService(this.piskelController);
            this.fileDropperService.init();

            this.userWarningController = new pskl.controller.UserWarningController(this.piskelController);
            this.userWarningController.init();

            this.performanceReportService = new pskl.service.performance.PerformanceReportService(
                this.piskelController,
                this.currentColorsService);
            this.performanceReportService.init();

            this.clipboardService = new pskl.service.ClipboardService(this.piskelController);
            this.clipboardService.init();

            this.drawingLoop = new pskl.rendering.DrawingLoop();
            this.drawingLoop.addCallback(this.render, this);
            this.drawingLoop.start();

            this.initTooltips_();

            var piskelData = this.getPiskelInitData_();
            if (piskelData && piskelData.piskel) {
                this.loadPiskel_(piskelData);
            }

            if (pskl.devtools) {
                pskl.devtools.init();
            }

            if (pskl.utils.Environment.detectNodeWebkit() && pskl.utils.UserAgent.isMac) {
                var gui = require('nw.gui');
                var mb = new gui.Menu({ type: 'menubar' });
                mb.createMacBuiltin('Piskel');
                gui.Window.get().menu = mb;
            }

            if (!pskl.utils.Environment.isIntegrationTest() && pskl.utils.UserAgent.isUnsupported()) {
                $.publish(Events.DIALOG_SHOW, {
                    dialogId: 'unsupported-browser'
                });
            }

            if (pskl.utils.Environment.isDebug()) {
                //@ts-ignore
                pskl.app.shortcutService.registerShortcut(pskl.service.keyboard.Shortcuts.DEBUG.RELOAD_STYLES, window.reloadStyles);
            }
        }

        export function loadPiskel_(piskelData) {
            var serializedPiskel = piskelData.piskel;
            //@ts-ignore
            pskl.utils.serialization.Deserializer.deserialize(serializedPiskel, function (piskel) {
                pskl.app.piskelController.setPiskel(piskel);

                $.publish(Events.PISKEL_SAVED);
                if (piskelData.descriptor) {
                    // Backward compatibility for v2 or older
                    piskel.setDescriptor(piskelData.descriptor);
                }
            });
        }

        export function getPiskelInitData_() {
            return pskl.appEnginePiskelData_;
        }

        export function isLoggedIn() {
            var piskelData = this.getPiskelInitData_();
            return piskelData && piskelData.isLoggedIn;
        }

        export function initTooltips_() {
            //@ts-ignore
            $('body').tooltip({
                selector: '[rel=tooltip]'
            });
        }

        export function render(delta) {
            this.drawingController.render(delta);
            this.previewController.render(delta);
            this.framesListController.render(delta);
        }

        export function getFirstFrameAsPng() {
            var frame = pskl.utils.LayerUtils.mergeFrameAt(this.piskelController.getLayers(), 0);
            var canvas;
            if (frame instanceof pskl.model.frame.RenderedFrame) {
                canvas = pskl.utils.CanvasUtils.createFromImage(frame.getRenderedFrame());
            } else {
                canvas = pskl.utils.FrameUtils.toImage(frame);
            }
            return canvas.toDataURL('image/png');
        }

        export function getFramesheetAsPng() {
            var renderer = new pskl.rendering.PiskelRenderer(this.piskelController);
            var framesheetCanvas = renderer.renderAsCanvas();
            return framesheetCanvas.toDataURL('image/png');
        }
    }
}

