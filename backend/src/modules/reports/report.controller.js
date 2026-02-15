import {
  getLowStockProducts,
  getSalesSummary,
  getTopSellingProducts,
} from "./report.service.js";

export async function dashboardReportController(req, res) {
  const [lowStock, salesSummary, topProducts] = await Promise.all([
    getLowStockProducts(),
    getSalesSummary(),
    getTopSellingProducts(),
  ]);

  res.json({
    lowStock,
    salesSummary,
    topProducts,
  });
}
