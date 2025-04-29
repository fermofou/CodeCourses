import { useState } from "react";
import { Table, Button, Modal, Input, Upload, message } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface MedalType {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  requirement: string;
  createdAt: string;
}

const Medals = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedal, setCurrentMedal] = useState<MedalType | null>(null);

  // Mock data
  const [medalsData] = useState<MedalType[]>([
    {
      id: 1,
      name: "Primer Problema",
      description: "Resuelve tu primer problema en la plataforma",
      imageUrl: "/assets/first-problem.png",
      category: "Logro",
      requirement: "Resolver 1 problema",
      createdAt: "2025-04-29",
    },
    {
      id: 2,
      name: "Maestro del Código",
      description: "Resuelve 100 problemas",
      imageUrl: "/assets/master-coder.png",
      category: "Experto",
      requirement: "Resolver 100 problemas",
      createdAt: "2025-04-29",
    },
  ]);

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
              target.src = 'https://via.placeholder.com/40';
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
      title: "Categoría",
      dataIndex: "category",
      key: "category",
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
          <Button 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
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
    setIsModalVisible(true);
  };

  const showEditModal = (medal: MedalType) => {
    setIsEditing(true);
    setCurrentMedal(medal);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    message.success('Medalla eliminada correctamente');
  };

  const handleOk = () => {
    message.success(isEditing ? 'Medalla actualizada correctamente' : 'Medalla creada correctamente');
    setIsModalVisible(false);
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
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={showAddModal}
        >
          Añadir Medalla
        </Button>
      </div>

      <Table columns={columns} dataSource={medalsData} />

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <Input 
              placeholder="Nombre de la medalla"
              defaultValue={currentMedal?.name}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <Input.TextArea 
              rows={3}
              placeholder="Descripción de la medalla"
              defaultValue={currentMedal?.description}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <Input 
              placeholder="Categoría de la medalla"
              defaultValue={currentMedal?.category}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requisito
            </label>
            <Input 
              placeholder="Requisito para obtener la medalla"
              defaultValue={currentMedal?.requirement}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <Upload
              maxCount={1}
              listType="picture"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Medals;