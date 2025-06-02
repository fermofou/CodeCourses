import { Modal, Avatar, Tag, Statistic, Row, Col, Divider } from "antd";
import { Trophy, Star, Target } from "lucide-react";
import { useState, useEffect } from "react";

interface Badge {
  badge_id: number;
  name: string;
  description: string;
  requirement: string;
  image_url: string;
  created_at: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    level: number;
    points: number;
    mail: string;
    is_admin: boolean;
  } | null;
}

const calculateRank = (level: number): string => {
  if (level >= 100) return "Grandmaster";
  if (level >= 80) return "Master";
  if (level >= 60) return "Candidate";
  if (level >= 40) return "Expert";
  if (level >= 20) return "Specialist";
  if (level >= 10) return "Pupil";
  return "Newbie";
};

const getRankColor = (rank: string): string => {
  switch (rank) {
    case "Grandmaster": return "text-[#FF0000]";
    case "Master": return "text-[#FF8C00]";
    case "Candidate": return "text-[#AA00AA]";
    case "Expert": return "text-[#0000FF]";
    case "Specialist": return "text-[#03A89E]";
    case "Pupil": return "text-[#008000]";
    case "Newbie": return "text-[#808080]";
    default: return "";
  }
};

const UserProfileModal = ({ isOpen, onClose, user }: UserProfileModalProps) => {
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        console.log('Fetching badges for user:', user.id);
        const response = await fetch(`http://142.93.10.227:8080/admin/user/${user.id}/badges`);
        if (!response.ok) throw new Error('Failed to fetch badges');
        const data = await response.json();
        console.log('Received badges data:', data);
        setUserBadges(data || []);
      } catch (error) {
        console.error('Error fetching user badges:', error);
        setUserBadges([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && user) {
      console.log('Modal opened for user:', user);
      fetchUserBadges();
    }
  }, [isOpen, user]);

  if (!user) return null;

  const rank = calculateRank(user.level);
  const rankColor = getRankColor(rank);
  const badgesCount = userBadges?.length || 0;

  console.log('Current badges state:', userBadges);
  console.log('Badges count:', badgesCount);

  return (
    <Modal
      title="User Profile"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar size={64} className="border border-gray-200">
            {user.name.charAt(0)}
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <span className={`text-lg font-medium ${rankColor}`}>{rank}</span>
          </div>
        </div>

        <Divider />

        <Row gutter={[16, 16]} className="mb-6">
          <Col span={8}>
            <Statistic
              title="Level"
              value={user.level}
              prefix={<Target className="w-4 h-4" />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Points"
              value={user.points}
              prefix={<Star className="w-4 h-4" />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Badges"
              value={badgesCount}
              prefix={<Trophy className="w-4 h-4" />}
            />
          </Col>
        </Row>

        <Divider />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Achievements</h3>
            {loading ? (
              <div className="text-gray-500">Loading badges...</div>
            ) : badgesCount > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {userBadges
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 3)
                  .map((badge) => (
                    <div 
                      key={badge.badge_id} 
                      className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      title={`${badge.name} - ${badge.description}`}
                    >
                      {badge.image_url ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 mb-2 flex items-center justify-center bg-white">
                          <img 
                            src={badge.image_url} 
                            alt={badge.name}
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 mb-2 flex items-center justify-center">
                          <Trophy className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-center">{badge.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(badge.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-500">No badges earned yet</div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">All Badges</h3>
            {loading ? (
              <div className="text-gray-500">Loading badges...</div>
            ) : badgesCount > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userBadges.map((badge) => (
                  <Tag 
                    key={badge.badge_id} 
                    color="blue"
                    title={`${badge.description} - Awarded on ${new Date(badge.created_at).toLocaleDateString()}`}
                  >
                    {badge.name}
                  </Tag>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No badges earned yet</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal; 