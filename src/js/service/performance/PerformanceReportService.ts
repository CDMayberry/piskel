module pskl {
    export module service {
        export module performance {
            export class PerformanceReportService {
                piskelController: any;
                currentColorsService: any;
                currentReport: any;

                constructor(piskelController, currentColorsService) {
                    this.piskelController = piskelController;
                    this.currentColorsService = currentColorsService;

                    this.currentReport = null;
                }


                init() {
                    $.subscribe(Events.HISTORY_STATE_SAVED, this.createReport_.bind(this));
                }

                createReport_() {
                    var report = new PerformanceReport(
                        this.piskelController.getPiskel(),
                        this.currentColorsService.getCurrentColors().length);

                    if (!report.equals(this.currentReport)) {
                        $.publish(Events.PERFORMANCE_REPORT_CHANGED, [report]);
                        this.currentReport = report;
                    }
                }

                hasProblem() {
                    return this.currentReport && this.currentReport.hasProblem();
                }
            }
        }
    }
}