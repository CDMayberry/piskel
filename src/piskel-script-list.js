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
  "js/database/BackupDatabase.js",
  "js/database/PiskelDatabase.js",
  "js/database/migrate/MigrateLocalStorageToIndexedDb.js",

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
  "js/service/storage/StorageService.js",
  "js/service/storage/FileDownloadStorageService.js",
  "js/service/storage/IndexedDbStorageService.js",
  "js/service/storage/LocalStorageService.js",
  "js/service/storage/GalleryStorageService.js",
  "js/service/storage/DesktopStorageService.js",
  "js/service/BackupService.js",
  "js/service/BeforeUnloadService.js",
  "js/service/HistoryService.js",
  "js/service/color/ColorSorter.js",
  "js/service/palette/CurrentColorsPalette.js",
  "js/service/palette/PaletteService.js",
  "js/service/palette/PaletteGplWriter.js",
  "js/service/palette/reader/AbstractPaletteFileReader.js",
  "js/service/palette/reader/PaletteGplReader.js",
  "js/service/palette/reader/PaletteImageReader.js",
  "js/service/palette/reader/PalettePalReader.js",
  "js/service/palette/reader/PaletteTxtReader.js",
  "js/service/palette/PaletteImportService.js",
  "js/service/pensize/PenSizeService.js",
  "js/service/SavedStatusService.js",
  "js/service/keyboard/KeycodeTranslator.js",
  "js/service/keyboard/KeyUtils.js",
  "js/service/keyboard/Shortcut.js",
  "js/service/keyboard/Shortcuts.js",
  "js/service/keyboard/ShortcutService.js",
  "js/service/ImportService.js",
  "js/service/ImageUploadService.js",
  "js/service/ClipboardService.js",
  "js/service/CurrentColorsService.js",
  "js/service/FileDropperService.js",
  "js/service/SelectedColorsService.js",
  "js/service/MouseStateService.js",
  "js/service/performance/PerformanceReport.js",
  "js/service/performance/PerformanceReportService.js",

  // Tools
  "js/compiled/tools/ToolsHelper.js",
  "js/compiled/tools/Tool.js",
  "js/compiled/tools/ToolIconBuilder.js",
  "js/tools/drawing/BaseTool.js",
  "js/tools/drawing/ShapeTool.js",
  "js/tools/drawing/SimplePen.js",
  "js/tools/drawing/Lighten.js",
  "js/tools/drawing/VerticalMirrorPen.js",
  "js/tools/drawing/Eraser.js",
  "js/tools/drawing/Stroke.js",
  "js/tools/drawing/PaintBucket.js",
  "js/tools/drawing/Rectangle.js",
  "js/tools/drawing/Circle.js",
  "js/tools/drawing/Move.js",
  "js/tools/drawing/selection/BaseSelect.js",
  "js/tools/drawing/selection/AbstractDragSelect.js",
  "js/tools/drawing/selection/LassoSelect.js",
  "js/tools/drawing/selection/RectangleSelect.js",
  "js/tools/drawing/selection/ShapeSelect.js",
  "js/tools/drawing/ColorPicker.js",
  "js/tools/drawing/ColorSwap.js",
  "js/tools/drawing/DitheringTool.js",
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
