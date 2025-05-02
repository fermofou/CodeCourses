import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
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
      })
      .catch((err) => {
        console.error("Error fetching badges:", err);
        message.error("Error al cargar las medallas.");
      });
  }, []);

  const columns: ColumnsType<MedalType> = [
    {
      title: "Medalla",
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
              target.src = "https://imanolgzz.com/_next/image?url=%2Fimages%2FmainPhoto.jpg&w=1920&q=75/40";
            }}
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Requisito",
      dataIndex: "requirement",
      key: "requirement",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Editar
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Eliminar
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
        if (!res.ok) throw new Error("Error al eliminar medalla");
        return res.json();
      })
      .then(() => {
        message.success("Medalla eliminada correctamente");
        setMedalsData((prev) => prev.filter((medal) => medal.id !== id));
      })
      .catch((err) => {
        console.error(err);
        message.error("Error al eliminar la medalla");
      });
  };

  const handleOk = () => {
    if (!name || !description || !requirement) {
      message.warning("Todos los campos son obligatorios");
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
        if (!res.ok) throw new Error("Error al guardar la medalla");
        return res.json();
      })
      .then((response) => {
        message.success(isEditing ? "Medalla actualizada" : "Medalla creada");

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
        message.error("Ocurrió un error");
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Medallas</h1>
        <p className="text-gray-600">Administra las medallas y logros de la plataforma</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Buscar medalla..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button type="primary" className="bg-blue-600" onClick={showAddModal}>
          Añadir Medalla
        </Button>
      </div>

      <Table columns={columns} dataSource={medalsData} rowKey="id" />

      <Modal
        title={isEditing ? "Editar Medalla" : "Añadir Medalla"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEditing ? "Guardar" : "Crear"}
        cancelText="Cancelar"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <Input
              placeholder="Nombre de la medalla"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <Input.TextArea
              rows={3}
              placeholder="Descripción de la medalla"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requisito</label>
            <Input
              placeholder="Requisito para obtener la medalla"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <Input
              placeholder="URL de la imagen"
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
