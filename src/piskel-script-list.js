// This list is used both by the grunt build and index.html (in debug mode)
// As scripts are converted to TS they need to be properly referenced here.

(typeof exports != "undefined" ? exports : pskl_exports).scripts = [
  // Core libraries
  "js/lib/jquery-1.8.0.js",
  "js/lib/jquery-ui-1.10.3.custom.js",
  "js/lib/pubsub.js",
  "js/lib/bootstrap/bootstrap.js",

  // Application wide configuration
  "js/compiled/Constants.js",
  "js/compiled/Events.js",

  // Libraries
  "js/compiled/utils/core.js",
  "js/compiled/utils/UserAgent.js",
  "js/compiled/utils/Array.js",
  "js/compiled/utils/Base64.js",
  "js/compiled/utils/BlobUtils.js",
  "js/compiled/utils/CanvasUtils.js",
  "js/compiled/utils/ColorUtils.js",
  "js/compiled/utils/DateUtils.js",
  "js/compiled/utils/Dom.js",
  "js/compiled/utils/Event.js",
  "js/compiled/utils/Environment.js",
  "js/compiled/utils/FunctionUtils.js",
  "js/compiled/utils/Math.js",
  "js/compiled/utils/FileUtils.js",
  "js/compiled/utils/FileUtilsDesktop.js",
  "js/compiled/utils/FrameUtils.js",
  "js/compiled/utils/ImageResizer.js",
  "js/compiled/utils/LayerUtils.js",
  "js/compiled/utils/MergeUtils.js",
  "js/compiled/utils/PixelUtils.js",
  "js/compiled/utils/PiskelFileUtils.js",
  "js/compiled/utils/ResizeUtils.js",
  "js/compiled/utils/StringUtils.js",
  "js/compiled/utils/Template.js",
  "js/compiled/utils/TooltipFormatter.js",
  "js/compiled/utils/UserSettings.js",
  "js/compiled/utils/Uuid.js",
  "js/compiled/utils/WorkerUtils.js",
  "js/compiled/utils/Xhr.js",
  "js/compiled/utils/serialization/Serializer.js",
  "js/compiled/utils/serialization/Deserializer.js",
  "js/compiled/utils/serialization/arraybuffer/ArrayBufferDeserializer.js",
  "js/compiled/utils/serialization/arraybuffer/ArrayBufferSerializer.js",
  "js/compiled/utils/serialization/backward/Deserializer_v0.js",
  "js/compiled/utils/serialization/backward/Deserializer_v1.js",

    // GIF Encoding libraries
  "js/lib/gif/gif.worker.js",
  "js/lib/gif/gif.js",
  "js/lib/gif/libgif.js",

  // JSZip https://github.com/Stuk/jszip
  "js/lib/jszip/jszip.min.js",

  "js/lib/scrollifneeded/scrollifneeded.js",
  // Smoothscroll: https://github.com/iamdustan/smoothscroll
  "js/lib/smoothscroll/smoothscroll.js",

  // Spectrum color-picker library
  "js/lib/spectrum/spectrum.js",

  // Promises
  "js/lib/q.js",

  // Application libraries
  "js/rendering/DrawingLoop.js",

  // Models
  "js/compiled/model/Frame.js",
  "js/compiled/model/Layer.js",
  "js/compiled/model/piskel/Descriptor.js",
  "js/compiled/model/frame/CachedFrameProcessor.js",
  "js/compiled/model/frame/AsyncCachedFrameProcessor.js",
  "js/compiled/model/frame/RenderedFrame.js",
  "js/compiled/model/Palette.js",
  "js/compiled/model/Piskel.js",

  // Database (IndexedDB)
  "js/compiled/database/BackupDatabase.js",
  "js/compiled/database/PiskelDatabase.js",
  "js/compiled/database/migrate/MigrateLocalStorageToIndexedDb.js",

  // Selection
  "js/selection/SelectionManager.js",
  "js/selection/BaseSelection.js",
  "js/selection/LassoSelection.js",
  "js/selection/RectangularSelection.js",
  "js/selection/ShapeSelection.js",

  // Rendering
  "js/rendering/AbstractRenderer.js",
  "js/rendering/CompositeRenderer.js",
  "js/rendering/layer/LayersRenderer.js",
  "js/rendering/frame/FrameRenderer.js",
  "js/rendering/OnionSkinRenderer.js",
  "js/rendering/frame/BackgroundImageFrameRenderer.js",
  "js/rendering/frame/CachedFrameRenderer.js",
  "js/rendering/CanvasRenderer.js",
  "js/rendering/FramesheetRenderer.js",
  "js/rendering/PiskelRenderer.js",

  // Controllers
  "js/controller/piskel/PiskelController.js",
  "js/controller/piskel/PublicPiskelController.js",
  "js/controller/CursorCoordinatesController.js",
  "js/controller/DrawingController.js",
  "js/controller/drawing/DragHandler.js",
  "js/controller/FramesListController.js",
  "js/controller/HeaderController.js",
  "js/controller/LayersListController.js",
  "js/controller/preview/PopupPreviewController.js",
  "js/controller/preview/PreviewActionsController.js",
  "js/controller/preview/PreviewController.js",
  "js/controller/MinimapController.js",
  "js/controller/ToolController.js",
  "js/controller/PaletteController.js",
  "js/controller/PalettesListController.js",
  "js/controller/PenSizeController.js",
  "js/controller/ProgressBarController.js",
  "js/controller/NotificationController.js",
  "js/controller/TransformationsController.js",
  "js/controller/CanvasBackgroundController.js",
  "js/controller/UserWarningController.js",

  // Settings sub-controllers
  "js/controller/settings/AbstractSettingController.js",
  "js/controller/settings/preferences/GridPreferencesController.js",
  "js/controller/settings/preferences/MiscPreferencesController.js",
  "js/controller/settings/preferences/TilePreferencesController.js",
  "js/controller/settings/PreferencesController.js",
  "js/controller/settings/exportimage/GifExportController.js",
  "js/controller/settings/exportimage/PngExportController.js",
  "js/controller/settings/exportimage/ZipExportController.js",
  "js/controller/settings/exportimage/MiscExportController.js",
  "js/controller/settings/exportimage/ExportController.js",
  "js/controller/settings/resize/ResizeController.js",
  "js/controller/settings/resize/DefaultSizeController.js",
  "js/controller/settings/SaveController.js",
  "js/controller/settings/ImportController.js",

  // Settings controller
  "js/controller/settings/SettingsController.js",

  // Dialogs sub-controllers
  "js/controller/dialogs/AbstractDialogController.js",
  "js/controller/dialogs/CreatePaletteController.js",
  "js/controller/dialogs/BrowseLocalController.js",
  "js/controller/dialogs/CheatsheetController.js",
  "js/controller/dialogs/backups/steps/SelectSession.js",
  "js/controller/dialogs/backups/steps/SessionDetails.js",
  "js/controller/dialogs/backups/BrowseBackups.js",
  "js/controller/dialogs/importwizard/steps/AbstractImportStep.js",
  "js/controller/dialogs/importwizard/steps/AdjustSize.js",
  "js/controller/dialogs/importwizard/steps/ImageImport.js",
  "js/controller/dialogs/importwizard/steps/InsertLocation.js",
  "js/controller/dialogs/importwizard/steps/SelectMode.js",
  "js/controller/dialogs/importwizard/ImportWizard.js",
  "js/controller/dialogs/PerformanceInfoController.js",
  "js/controller/dialogs/UnsupportedBrowserController.js",

  // Dialogs controller
  "js/controller/dialogs/DialogsController.js",

  // Widgets
  "js/compiled/widgets/AnchorWidget.js",
  "js/compiled/widgets/ColorsList.js",
  "js/compiled/widgets/FramePicker.js",
  "js/compiled/widgets/HslRgbColorPicker.js",
  "js/compiled/widgets/SizeInput.js",
  "js/compiled/widgets/SizePicker.js",
  "js/compiled/widgets/SynchronizedInputs.js",
  "js/compiled/widgets/Tabs.js",
  "js/compiled/widgets/Wizard.js",

  // Services
  "js/compiled/service/storage/StorageService.js",
  "js/compiled/service/storage/FileDownloadStorageService.js",
  "js/compiled/service/storage/IndexedDbStorageService.js",
  "js/compiled/service/storage/LocalStorageService.js",
  "js/compiled/service/storage/GalleryStorageService.js",
  "js/compiled/service/storage/DesktopStorageService.js",
  "js/compiled/service/BackupService.js",
  "js/compiled/service/BeforeUnloadService.js",
  "js/compiled/service/HistoryService.js",
  "js/compiled/service/color/ColorSorter.js",
  "js/service/palette/CurrentColorsPalette.js",
  "js/service/palette/PaletteService.js",
  "js/service/palette/PaletteGplWriter.js",
  "js/service/palette/reader/AbstractPaletteFileReader.js",
  "js/service/palette/reader/PaletteGplReader.js",
  "js/service/palette/reader/PaletteImageReader.js",
  "js/service/palette/reader/PalettePalReader.js",
  "js/service/palette/reader/PaletteTxtReader.js",
  "js/service/palette/PaletteImportService.js",
  "js/compiled/service/pensize/PenSizeService.js",
  "js/compiled/service/SavedStatusService.js",
  "js/compiled/service/keyboard/KeycodeTranslator.js",
  "js/compiled/service/keyboard/KeyUtils.js",
  "js/compiled/service/keyboard/Shortcut.js",
  "js/compiled/service/keyboard/Shortcuts.js",
  "js/compiled/service/keyboard/ShortcutService.js",
  "js/compiled/service/ImportService.js",
  "js/compiled/service/ImageUploadService.js",
  "js/compiled/service/ClipboardService.js",
  "js/compiled/service/CurrentColorsService.js",
  "js/compiled/service/FileDropperService.js",
  "js/compiled/service/SelectedColorsService.js",
  "js/compiled/service/MouseStateService.js",
  "js/compiled/service/performance/PerformanceReport.js",
  "js/compiled/service/performance/PerformanceReportService.js",

  // Tools
  "js/compiled/tools/ToolsHelper.js",
  "js/compiled/tools/Tool.js",
  "js/compiled/tools/ToolIconBuilder.js",
  "js/compiled/tools/drawing/BaseTool.js",
  "js/compiled/tools/drawing/ShapeTool.js",
  "js/compiled/tools/drawing/SimplePen.js",
  "js/compiled/tools/drawing/Lighten.js",
  "js/compiled/tools/drawing/VerticalMirrorPen.js",
  "js/compiled/tools/drawing/Eraser.js",
  "js/compiled/tools/drawing/Stroke.js",
  "js/compiled/tools/drawing/PaintBucket.js",
  "js/compiled/tools/drawing/Rectangle.js",
  "js/compiled/tools/drawing/Circle.js",
  "js/compiled/tools/drawing/Move.js",
  "js/compiled/tools/drawing/selection/BaseSelect.js",
  "js/compiled/tools/drawing/selection/AbstractDragSelect.js",
  "js/compiled/tools/drawing/selection/LassoSelect.js",
  "js/compiled/tools/drawing/selection/RectangleSelect.js",
  "js/compiled/tools/drawing/selection/ShapeSelect.js",
  "js/compiled/tools/drawing/ColorPicker.js",
  "js/compiled/tools/drawing/ColorSwap.js",
  "js/compiled/tools/drawing/DitheringTool.js",
  "js/compiled/tools/transform/AbstractTransformTool.js",
  "js/compiled/tools/transform/Center.js",
  "js/compiled/tools/transform/Clone.js",
  "js/compiled/tools/transform/Crop.js",
  "js/compiled/tools/transform/Flip.js",
  "js/compiled/tools/transform/Rotate.js",
  "js/compiled/tools/transform/TransformUtils.js",

  // Devtools
  "js/devtools/DrawingTestPlayer.js",
  "js/devtools/DrawingTestRecorder.js",
  "js/devtools/DrawingTestRunner.js",
  "js/devtools/DrawingTestSuiteController.js",
  "js/devtools/DrawingTestSuiteRunner.js",
  "js/devtools/MouseEvent.js",
  "js/devtools/TestRecordController.js",
  "js/devtools/init.js",
  "js/devtools/lib/Blob.js",

  // Workers
  "js/compiled/worker/framecolors/FrameColorsWorker.js",
  "js/compiled/worker/framecolors/FrameColors.js",
  "js/compiled/worker/hash/HashWorker.js",
  "js/compiled/worker/hash/Hash.js",
  "js/compiled/worker/imageprocessor/ImageProcessorWorker.js",
  "js/compiled/worker/imageprocessor/ImageProcessor.js",

  // Application controller and initialization
  "js/compiled/app.js",

  // Bonus features !!
  "js/snippets.js"
];
