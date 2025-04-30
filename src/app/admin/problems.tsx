import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useUser } from "@clerk/clerk-react";

interface ApiProblemType {
  problem_id: number;
  title: string;
  difficulty: number;
  solved: boolean | null;
  tags?: string[];
  question: string;
  // Points might be added later
}

interface ProblemData {
  problem_id?: number;
  title: string;
  difficulty: number;
  tags: string[];
  question: string;
  testCases?: [
    {
      expectedOutput: string;
      input: string;
    }
  ];
}

const Problems = () => {
  const [problemsData, setProblemsData] = useState(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProblem, setLoadingProblem] = useState<boolean>(true);
  const [challengeData, setChallengeData] = useState<ProblemData>({
    title: "",
    difficulty: 1,
    tags: [],
    question: "",
    testCases: [{
      input: "",
      expectedOutput: "",
    }],
  });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [deletingID, setDeletingID] = useState<number | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  if (!user) return null;

  useEffect(() => {
    setLoading(true);
    fetch(`/problems?userId=${user.id}`)
      .then((response) => response.json())
      .then((data: ApiProblemType[]) => {
        // Map the API data to match our table structure
        const formattedProblems = data.map((problem) => {
          return {
            key: problem.problem_id,
            title: problem.title,
            difficulty: problem.difficulty,
            tags: problem.tags || ["coding"], // Default tag if not provided
            question: problem.question,

          };
        });
        setProblemsData(formattedProblems);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
        setLoading(false);
      });
  }, [refetch]);

  useEffect(() => {
    console.log("Zip file changed:", zipFile);
  }, [zipFile]);

  const fetchProblem = async (problemId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/challenge?probID=${problemId}&userID=${user.id}`);
      const data = await response.json();
      data.testCases = JSON.parse(data.tests);
      setChallengeData(data)
      return data;
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  }

  const showAddModal = () => {
    setIsEditing(false);
    setIsDeleting(false);
    setLoadingProblem(false);
    setIsModalVisible(true);
  };

  const showEditModal = async (record: any) => {
    setIsEditing(true);
    setIsDeleting(false);
    setLoadingProblem(true);
    setIsModalVisible(true);
    await fetchProblem(record.key);
    setLoadingProblem(false);
  };

  const showDeleteModal = async (record: any) => {
    setIsEditing(false);
    setIsDeleting(true);
    setLoadingProblem(false);
    setDeletingID(record.key);
    setIsModalVisible(true);
  }

  const validateForm = () => {
    if (challengeData.title === "" || challengeData.question === "") {
      alert("Por favor completa todos los campos requeridos.");
      return false;
    }

    if (challengeData.testCases?.some((testCase) => testCase.input === "" || testCase.expectedOutput === "")) {
      alert("Por favor no dejes campos vacíos en los testcases de ejemplo.");
      return false;
    }
    if (!isEditing && !zipFile) {
      alert("por favor selecciona un archivo zip.");
      return false;
    }

    return true;
  }

  const handleEditProblem = async () => {
    console.log(challengeData);
    const SampleTests = challengeData.testCases != undefined ? JSON.stringify(
      challengeData.testCases.map((testCase: any) => ({
        input: testCase.input, expectedOutput: testCase.expectedOutput,
      }))
    ) : "[]";
    const data = {
      problem_id: challengeData.problem_id,
      title: challengeData.title,
      difficulty: challengeData.difficulty,
      timeLimit: 5,
      memoryLimit: 256,
      sampleTests: SampleTests,
      question: challengeData.question,
    }
    try {
      const response = await fetch("http://localhost:8080/admin/editProblemStatement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      const res = await response.json();
      console.log("Response from server:", res);
    } catch (error) {
      console.error("Error uploading problem statement:", error);
    }

  }

  const handleUploadTestcases = async (problemId: number) => {
    if (!zipFile) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", zipFile);
    try {
      const response = await fetch(`http://localhost:8080/admin/uploadTestcases?problemId=${problemId}`, {
        method: "POST",
        body: formData,
      });
      const res = await response.json();
      console.log("Response from server:", res);
    } catch (error) {
      console.error("Error uploading test cases:", error);
    }
  }

  const handleUploadProblem = async () => {
    const newProblem = { ...challengeData, key: Date.now().toString() };
    const SampleTests = newProblem.testCases != undefined ? JSON.stringify(
      newProblem.testCases.map((testCase: any) => ({
        input: testCase.input, expectedOutput: testCase.expectedOutput,
      }))
    ) : "[]";

    const data = {
      title: newProblem.title,
      difficulty: newProblem.difficulty,
      timeLimit: 5,
      memoryLimit: 256,
      sampleTests: SampleTests,
      question: newProblem.question,
    };
    console.log("data", data);
    console.log("values", newProblem);

    try {
      const response = await fetch("http://localhost:8080/admin/uploadProblemStatement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      const res = await response.json();
      await handleUploadTestcases(res.problem_id);
      setRefetch(!refetch);
    } catch (error) {
      console.error("Error uploading problem statement:", error);
    }
  }

  const handleDeleteProblem = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/deleteProblem?problemId=${deletingID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error deleting problem");
      }
      const res = await response.json();
      console.log("Response from server:", res);
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
    setRefetch(!refetch);
  }

  const handleClose = () => {
    setIsModalVisible(false);
    setChallengeData({
      title: "",
      difficulty: 1,
      tags: [],
      question: "",
      testCases: [{
        input: "",
        expectedOutput: "",
      }],
    });
  }

  const handleOk = async () => {
    if (isEditing) {
      if (!validateForm()) {
        return;
      }
      setIsLoadingSave(true);
      await handleEditProblem();
    } else if (isDeleting) {
      setIsLoadingSave(true);
      await handleDeleteProblem();
    } else {
      if (!validateForm()) {
        return;
      }
      setIsLoadingSave(true);
      await handleUploadProblem();
    }
    setIsLoadingSave(false);
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
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
      render: (difficulty: number) => {
        const stars = {
          1: "★☆☆☆☆",
          2: "★★☆☆☆",
          3: "★★★☆☆",
          4: "★★★★☆",
          5: "★★★★★",
        };
        return <Tag>{stars[difficulty]}</Tag>;
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
          <Button icon={<EditOutlined />} onClick={() => { showEditModal(record); }}>
            Editar
          </Button>
          <Button danger onClick={() => { showDeleteModal(record); }}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Problemas</h1>
        <p className="text-gray-600">Administra y gestiona los problemas de la plataforma</p>
      </div>
      <Table columns={columns} dataSource={problemsData} />
      <Modal
        style={{ marginTop: "-3rem" }}
        title={isEditing ? "Editar Problema" : (isDeleting ? "Eliminar Problema" : "Agregar Problema")}
        visible={isModalVisible}
        onOk={handleOk}
        disabled={isLoadingSave}
        onCancel={handleCancel}
        okText={isEditing ? "Guardar" : (isDeleting ? "Eliminar" : "Agregar")}
        okButtonProps={{ loading: isLoadingSave }}
        cancelText="Cancelar"
      >
        {loadingProblem && <p>Cargando problema...</p>}
        {!loadingProblem && !isDeleting && (
          <>
            <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Título
              <Input value={challengeData.title} onChange={(e: any) => { setChallengeData({ ...challengeData, title: e.target.value }) }} placeholder="Título del problema" />
            </div>
            <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Dificultad
              <Select
                placeholder="Selecciona dificultad"
                value={challengeData.difficulty}
                onChange={(value) => { setChallengeData({ ...challengeData, difficulty: value }) }}
                options={[
                  { value: 1, label: "★☆☆☆☆ Muy Fácil" },
                  { value: 2, label: "★★☆☆☆ Fácil" },
                  { value: 3, label: "★★★☆☆ Media" },
                  { value: 4, label: "★★★★☆ Difícil" },
                  { value: 5, label: "★★★★★ Muy Difícil" },
                ]}
              />
            </div>
            <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Tags
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Tags"
                value={challengeData.tags}
                onChange={(value) => { setChallengeData({ ...challengeData, tags: value }) }}
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
            </div>
            <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Descripción
              <Input.TextArea
                value={challengeData.question}
                onChange={(e: any) => { setChallengeData({ ...challengeData, question: e.target.value }) }}
                rows={6}
                placeholder="Descripción del problema"
              />
            </div>
            <div>
              {(challengeData?.testCases || []).map((testCase, index) => (
                <div key={index} className="mb-4 border p-3 rounded-md">
                  <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label>Input de Prueba</label>
                    <Input.TextArea
                      rows={2}
                      placeholder="Input de prueba"
                      value={testCase.input}
                      onChange={(e: any) => {
                        const updatedTestCases = [...(challengeData?.testCases || [])];
                        updatedTestCases[index] = {
                          ...updatedTestCases[index],
                          input: e.target.value,
                        };
                        setChallengeData({ ...challengeData, testCases: updatedTestCases });
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label>Output de Prueba</label>
                    <Input.TextArea
                      rows={2}
                      placeholder="Output esperado"
                      value={testCase.expectedOutput}
                      onChange={(e: any) => {
                        const updatedTestCases = [...(challengeData?.testCases || [])];
                        updatedTestCases[index] = {
                          ...updatedTestCases[index],
                          expectedOutput: e.target.value,
                        };
                        setChallengeData({ ...challengeData, testCases: updatedTestCases });
                      }}
                    />
                  </div>

                  <Button danger onClick={() => {
                    const updatedTestCases = [...(challengeData?.testCases || [])];
                    updatedTestCases.splice(index, 1);
                    setChallengeData({ ...challengeData, testCases: updatedTestCases });
                  }}>
                    Eliminar Testcase de Ejemplo
                  </Button>
                </div>
              ))}
              <Button style={{ marginBottom: "1rem" }} type="dashed" onClick={() => {
                const updatedTestCases = [...(challengeData?.testCases || []), { input: "", expectedOutput: "" }];
                setChallengeData({ ...challengeData, testCases: updatedTestCases });
              }} block>
                Agregar Testcase de Ejemplo
              </Button>
            </div>
            {!isEditing && (
              <>
                <input
                  name="file"
                  type="file"
                  accept=".zip"
                  onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                />
                {zipFile && (
                  <div className="text-sm text-gray-600 italic mt-2">
                    Archivo seleccionado: {zipFile.name}
                  </div>
                )}
                <div className="text-sm text-gray-600 italic mt-2">
                  Asegúrate de que el archivo ZIP contenga los testcases en el formato:
                  <br />
                  <strong>1.in, 1.out, 2.in, 2.out, ...</strong>
                </div>
              </>
            )}
          </>
        )}
        {isDeleting && (
          <div>
            <p>¿Estás seguro de que deseas eliminar este problema?</p>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Problems;
