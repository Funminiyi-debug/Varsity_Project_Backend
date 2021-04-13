import DashboardMetrics from "../../interfaces/DashboardMetrics";

export default interface IDashboardService {
  getDashboardMetrics(): Promise<DashboardMetrics>;
}
