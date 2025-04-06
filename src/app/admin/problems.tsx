// problemas.tsx
import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const initialData = [
  {
    key: "1",
    title: "Sumar dos números",
    difficulty: "l2",
    tags: ["Math", "Básico"],
  },
  {
    key: "2",
    title: "Camino más corto en un grafo",
    difficulty: "l4",
    tags: ["Graphs", "Dijkstra"],
  },
  {
    key: "3",
    title: "Camino más largo en un grafo",
    difficulty: "l3",
    tags: ["Graphs", "Dijkstra"],
  },
];

const Problems = () => {
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProblem, setEditingProblem] = useState<any>(null);
  const [parsedURL, setParsedURL] = useState("");

  const [form] = Form.useForm();

  const showAddModal = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: any) => {
    setIsEditing(true);
    setEditingProblem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEditing) {
        setData(prev =>
          prev.map(item =>
            item.key === editingProblem.key ? { ...editingProblem, ...values } : item
          )
        );
      } else {
        const newProblem = { ...values, key: Date.now().toString() };
        setData(prev => [...prev, newProblem]);
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<any> = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Dificultad",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty: string) => {
        const stars = {
          "l1": "★☆☆☆☆",
          "l2": "★★☆☆☆",
          "l3": "★★★☆☆",
          "l4": "★★★★☆",
          "l5": "★★★★★",
        };
        return <Tag> {stars[difficulty]}</Tag>;
      },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-3">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Editar
          </Button>
          <Button danger>
            Eliminar   
          </Button> 
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Problemas</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          label="Agregar problema"
        />
      </div>
      <Table columns={columns} dataSource={data} />

      <Modal
        title={isEditing ? "Editar Problema" : "Agregar Problema"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Título"
            name="title"
            rules={[{ required: true, message: "Por favor ingresa el título" }]}
          >
            <Input id="problem-title" />
          </Form.Item>

          <Form.Item
            label="Dificultad"
            name="difficulty"
            rules={[{ required: true, message: "Selecciona una dificultad" }]}
          >
            <Select
              placeholder="Selecciona dificultad"
              options={[
                { value: "l1", label: "★☆☆☆☆ Muy Fácil" },
                { value: "l2", label: "★★☆☆☆ Fácil" },
                { value: "l3", label: "★★★☆☆ Media" },
                { value: "l4", label: "★★★★☆ Difícil" },
                { value: "l5", label: "★★★★★ Muy Difícil" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
            rules={[{ required: true, message: "Agrega al menos un tag" }]}
          >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Tags"
            options={[
            { value: "Math", label: "Math" },
            { value: "DP", label: "DP" },
            { value: "Greedy", label: "Greedy" },
            { value: "Graphs", label: "Graphs" },
            { value: "Binary Search", label: "Binary Search" },
            { value: "Brute Force", label: "Brute Force" },
            { value: "Combinatorics", label: "Combinatorics" },
            { value: "Data Structures", label: "Data Structures" },
            { value: "Divide and Conquer", label: "Divide and Conquer" },
            { value: "Geometry", label: "Geometry" },
            { value: "Implementation", label: "Implementation" },
            { value: "Number Theory", label: "Number Theory" },
            { value: "Shortest Paths", label: "Shortest Paths" },
            { value: "Sorting", label: "Sorting" },
            { value: "Strings", label: "Strings" },
            { value: "Trees", label: "Trees" },
            { value: "Two Pointers", label: "Two Pointers" },
            ]}
          />
          </Form.Item>

          {!isEditing && (
            <>
              <Form.Item label="Fuente del problema" name="source" rules={[{ required: true, message: "Selecciona la fuente" }]}>
                <Select
                  placeholder="Selecciona la fuente"
                  options={[
                    { value: "Codeforces", label: "Codeforces" },
                    { value: "AtCoder", label: "AtCoder" },
                    { value: "CSES", label: "CSES" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="URL del problema" name="url" rules={[{ required: true, message: "Por favor ingresa la URL" }]}>
                <Input placeholder="https://..." />
              </Form.Item>

              <Form.Item>
                <Button
                  onClick={() => {
                    const url = form.getFieldValue("url");
                    if (url) {
                      setParsedURL(`Procesado: ${url}`);
                    } else {
                      setParsedURL("Por favor ingresa una URL válida.");
                    }
                  }}
                >
                  Procesar
                </Button>
              </Form.Item>

              <div className="text-sm text-gray-600 italic">{parsedURL}</div>
            </>
          )}
        </Form>
      </Modal>

    </div>
  );
};

export default Problems;
