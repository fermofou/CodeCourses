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
    description: "Suma dos números enteros y devuelve el resultado.",
  },
  {
    key: "2",
    title: "Camino más corto en un grafo",
    difficulty: "l4",
    tags: ["Graphs", "Dijkstra"],
    description: "Encuentra el camino más corto entre dos nodos en un grafo.",
  },
  {
    key: "3",
    title: "Camino más largo en un grafo",
    difficulty: "l3",
    tags: ["Graphs", "Dijkstra"],
    description: "Encuentra el camino más largo entre dos nodos en un grafo.",
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
        <Form
          form={form}
          layout="vertical"
          onFinish={values => {
            console.log("Form values:", values);
            if (!values.zipFile) {
              return;
            }
            handleOk();
          }}
        >
        <Form.Item
          label="Título"
          style={{ marginBottom: "1rem" }}
          name="title"
          rules={[{ required: true, message: "Por favor ingresa el título" }]}
        >
          <Input id="problem-title" />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "1rem" }}
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
          style={{ marginBottom: "1rem" }}
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
          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
          >
            <Input.TextArea rows={7} placeholder="Descripción del problema" />
          </Form.Item>
          <Form.List name="testCases">
            {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} className="mb-4 border p-3 rounded-md">
              <Form.Item
                {...restField}
                label="Input de Prueba"
                name={[name, "testInput"]}
                fieldKey={[fieldKey, "testInput"]}
                rules={[{ required: true, message: "Por favor ingresa un input de prueba" }]}
              >
                <Input.TextArea rows={2} placeholder="Input de prueba" />
              </Form.Item>

              <Form.Item
                {...restField}
                label="Output de Prueba"
                name={[name, "testOutput"]}
                fieldKey={[fieldKey, "testOutput"]}
                rules={[{ required: true, message: "Por favor ingresa el output esperado" }]}
              >
                <Input.TextArea rows={2} placeholder="Output esperado" />
              </Form.Item>

              <Button danger onClick={() => remove(name)}>
                Eliminar Testcase de Ejemplo 
              </Button>
                </div>
              ))}
              <Button style={{marginBottom: "1rem"}} type="dashed" onClick={() => add()} block>
                Agregar Testcase de Ejemplo 
              </Button>
            </>
            )}
          </Form.List>
          {!isEditing && (
          <>
            <Form.Item
              label="Subir Testcases (ZIP)"
              name="zipFile"
              rules={[{ required: true, message: "Por favor sube un archivo ZIP con los testcases" }]}
              valuePropName="zipFile"
              getValueFromEvent={(e) => e} // importante para capturar el evento original
            >
              <input type="file" accept=".zip" />
            </Form.Item>
            <div className="text-sm text-gray-600 italic mt-2">
              Asegúrate de que el archivo ZIP contenga los testcases en el formato: 
              <br />
              <strong>1.in, 1.out, 2.in, 2.out, ...</strong>
            </div>
          </>
          )}
        </Form>
      </Modal>

    </div>
  );
};

export default Problems;
