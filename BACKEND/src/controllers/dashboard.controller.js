import CustomThrowError from '../helpers/custom.throw.error.js';

class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
    this.adminDashboard = this.adminDashboard.bind(this);
    this.driverDashboard = this.driverDashboard.bind(this);
  }

  async adminDashboard(req, res, next) {
    try {
      const data = await this.dashboardService.adminDashboard();
      return res.json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async driverDashboard(req, res, next) {
    try {
      const user = req.user;
      if (!user) throw CustomThrowError('auth', 'Unauthorized', 401);
      const data = await this.dashboardService.driverDashboard(user.id);
      return res.json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }
}

export default DashboardController;
