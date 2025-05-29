import { Card, Row, Col, Statistic, Table, List } from "antd";
import { Users, Trophy, Target, Activity, Database, ShoppingCart, Code} from "lucide-react";
import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {
  // Mock data
  /* const stats = {
    totalUsers: 150,
    totalBadges: 25,
    averageLevel: 35,
    activeSessions: 12,
    totalProblems: 87,
    rewardsRedeemed: [
      { reward: "Mochila", timesRedeemed: 5 },
      { reward: "Taza", timesRedeemed: 3 }
    ],
    popularLanguages: [
      { language: "C++", submissions: "4" },
      { language: "Python", sumbissions: "1" }
    ],
    newUsers: [
      { name: "Sofía Álvarez", date: "3 hours ago" },
      { name: "Luis Mendoza", date: "yesterday" }
    ],
  };

  const userGrowthData = [
      { week: "Week 1", badges: 1 },
      { week: "Week 2", badges: 3 },
      { week: "Week 3", badges: 2 },
      { week: "Week 4", badges: 6 },
      { week: "Week 5", badges: 8 },]; */

  const [stats, setStats] = useState<any | null>(null);

  useEffect(() => {
  fetch("/api/admin/stats")
    .then((res) => res.json())
    .then((data) => setStats(data))
    .catch((err) => console.error("Failed to load stats", err));
  }, []);

  if (!stats) return <p className="text-center">Loading admin dashboard...</p>;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">General performance and activity on the platform</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total users" value={stats.totalUsers} prefix={<Users className="w-4 h-4" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Available problems" value={stats.totalProblems} prefix={<Database className="w-4 h-4" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Average level" value={stats.averageLevel} prefix={<Target className="w-4 h-4" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Active sessions" value={stats.activeSessions} prefix={<Activity className="w-4 h-4" />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Recent activity">
            <List
              dataSource={[
                { icon: <Trophy className="w-4 h-4 text-blue-600" />, title: "New Badge", desc: "Roger achieved 'Problem Solver'", time: "3 days ago" },
                { icon: <Target className="w-4 h-4 text-green-600" />, title: "Level up", desc: "Imanol reached level 25", time: "4 days ago" }
              ]}
              renderItem={(item) => (
                <List.Item className="hover:bg-gray-50 rounded p-2 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded-full">{item.icon}</div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="New users">
            <List
              dataSource={stats.newUsers || []}
              renderItem={(user) => (
                <List.Item>
                  <Users className="mr-2 text-indigo-600" />
                  <span className="font-medium">{user.name}</span> — {user.date}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Most claimed rewards">
            <List
              dataSource={stats.rewardsRedeemed || []}
              renderItem={(item) => (
                <List.Item>
                  <ShoppingCart className="mr-2 text-yellow-600" />
                  <span className="font-medium">{item.reward}</span> — {item.timesRedeemed} times redeemed
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Most popular languages">
            <List
              dataSource={stats.popularLanguages || []}
              renderItem={(item) => (
                <List.Item>
                  <Code className="mr-2 text-green-600" />
                  <span className="font-medium">{item.language}</span> — {item.submissions} submissions
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card title="Badges obtained by users (Recent weeks)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.userGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="badges" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;