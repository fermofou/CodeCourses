import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, notification } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";


interface MedalType {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  requirement: string;
  createdAt: string;
}

const Medals = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedal, setCurrentMedal] = useState<MedalType | null>(null);
  const [medalsData, setMedalsData] = useState<MedalType[]>([]);
  const [originalMedalsData, setOriginalMedalsData] = useState<MedalType[]>([]);
  const [api, contextHolder] = notification.useNotification();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetch("/api/badges")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((badge: any) => ({
          id: badge.badge_id,
          name: badge.name,
          description: badge.description,
          imageUrl: badge.image_url,
          requirement: badge.requirement,
          createdAt: badge.created_at,
        }));
        setMedalsData(formatted);
        setOriginalMedalsData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching badges:", err);
        api.error({
          message: "Error Loading Medals",
          description: "Failed to load medals. Please try again later.",
          placement: "topRight",
          duration: 4,
        });
      });
  }, []);

  const columns: ColumnsType<MedalType> = [
    {
      title: "Medal",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <img
            src={record.imageUrl}
            alt={text}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://imanolgzz.com/_next/image?url=%2Fimages%2FmainPhoto.jpg&w=1920&q=75";
            }}
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Requirement",
      dataIndex: "requirement",
      key: "requirement",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const showAddModal = () => {
    setIsEditing(false);
    setCurrentMedal(null);
    setName("");
    setDescription("");
    setRequirement("");
    setImageUrl("");
    setIsModalVisible(true);
  };

  const showEditModal = (medal: MedalType) => {
    setIsEditing(true);
    setCurrentMedal(medal);
    setName(medal.name);
    setDescription(medal.description);
    setRequirement(medal.requirement);
    setImageUrl(medal.imageUrl);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    fetch(`/api/badges/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error deleting medal");
        return res.json();
      })
      .then(() => {
        api.success({
          message: "Medal Deleted",
          description: "The medal was successfully deleted.",
          placement: "topRight",
          duration: 4,
        });
        setMedalsData((prev) => prev.filter((medal) => medal.id !== id));
        setOriginalMedalsData((prev) => prev.filter((medal) => medal.id !== id));
      })
      .catch((err) => {
        console.error(err);
        api.error({
          message: "Delete Failed",
          description: "Failed to delete the medal. Please try again.",
          placement: "topRight",
          duration: 4,
        });
      });
  };

  const handleOk = () => {
    if (!name || !description || !requirement) {
      api.warning({
        message: "Required Fields",
        description: "Please fill in all required fields.",
        placement: "topRight",
        duration: 4,
      });
      return;
    }

    const body = {
      name,
      description,
      requirement,
      image_url: imageUrl || "https://imanolgzz.com/_next/image?url=%2Fimages%2FmainPhoto.jpg&w=1920&q=75/40",
    };

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/badges/${currentMedal?.id}`
      : "/api/badges";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error saving medal");
        return res.json();
      })
      .then((response) => {
        api.success({
          message: isEditing ? "Medal Updated" : "Medal Created",
          description: isEditing 
            ? "The medal was successfully updated."
            : "A new medal was successfully created.",
          placement: "topRight",
          duration: 4,
        });

        const newMedal: MedalType = {
          id: isEditing ? currentMedal!.id : response.badge_id,
          name,
          description,
          requirement,
          imageUrl: imageUrl || "https://imanolgzz.com/_next/image?url=%2Fimages%2FmainPhoto.jpg&w=1920&q=75/40",
          createdAt: new Date().toISOString(),
        };

        setMedalsData((prev) =>
          isEditing
            ? prev.map((m) => (m.id === currentMedal!.id ? newMedal : m))
            : [...prev, newMedal]
        );

        setIsModalVisible(false);
        setName("");
        setDescription("");
        setRequirement("");
        setImageUrl("");
        setCurrentMedal(null);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
        api.error({
          message: "Operation Failed",
          description: "An error occurred while saving the medal. Please try again.",
          placement: "topRight",
          duration: 4,
        });
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="w-full">
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Medals</h1>
        <p className="text-gray-600">Manage and administer platform medals</p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Search medals..."
            style={{ width: 250 }}
            allowClear
            onChange={(e) => {
              const searchValue = e.target.value;
              if (!searchValue) {
                setMedalsData(originalMedalsData);
                return;
              }
              const filteredMedals = originalMedalsData.filter(medal => 
                medal.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                medal.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                medal.requirement.toLowerCase().includes(searchValue.toLowerCase())
              );
              setMedalsData(filteredMedals);
            }}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          label="Add Medal"
        />
      </div>

      <Table columns={columns} dataSource={medalsData} rowKey="id" />

      <Modal
        title={isEditing ? "Edit Medal" : "Add Medal"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEditing ? "Save" : "Create"}
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              placeholder="Medal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input.TextArea
              rows={3}
              placeholder="Medal description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirement</label>
            <Input
              placeholder="Requirement to earn the medal"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL of image</label>
            <Input
              placeholder="URL of the image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Medals;
