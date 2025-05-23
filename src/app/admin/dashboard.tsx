import { Card, Row, Col, Statistic } from "antd";
import { Users, Trophy, Target, Activity } from "lucide-react";

const AdminDashboard = () => {
  // Demo data - replace with real data later
  const stats = {
    totalUsers: 150,
    totalBadges: 25,
    averageLevel: 35,
    activeSessions: 12
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of platform statistics and activity</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<Users className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Badges"
              value={stats.totalBadges}
              prefix={<Trophy className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Level"
              value={stats.averageLevel}
              prefix={<Target className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Sessions"
              value={stats.activeSessions}
              prefix={<Activity className="w-4 h-4" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New Badge Earned</p>
                    <p className="text-sm text-gray-500">Roger earned "Problem Solver" badge</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2m ago</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Level Up</p>
                    <p className="text-sm text-gray-500">Imanol reached level 25</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">15m ago</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Popular Badges">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Problem Solver</p>
                    <p className="text-sm text-gray-500">45 users have this badge</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Speed Demon</p>
                    <p className="text-sm text-gray-500">32 users have this badge</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard; 