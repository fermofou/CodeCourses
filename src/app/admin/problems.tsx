import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Tag, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useUser } from "@clerk/clerk-react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

interface ApiProblemType {
  problem_id: number;
  title: string;
  difficulty: number;
  solved: boolean | null;
  tags?: string[];
  question: string;
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
  const [api, contextHolder] = notification.useNotification();
  const [challengeData, setChallengeData] = useState<ProblemData>({
    title: "",
    difficulty: 1,
    tags: [],
    question: "",
    testCases: [
      {
        input: "",
        expectedOutput: "",
      },
    ],
  });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [deletingID, setDeletingID] = useState<number | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [searchText, setSearchText] = useState(""); // New state for search
  const { isLoaded, user } = useUser();

  // New states for AI improvement confirmation
  const [isAiModalVisible, setIsAiModalVisible] = useState(false);
  const [aiGeneratedText, setAiGeneratedText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id);
    }
  }, [isLoaded, user]);

  if (!isLoaded) return null;

  if (!user) return null;

  const rewriteStatement = async (statement: string): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        Eres un generador de problemas de programación contextualizados. Vas a recibir un problema clásico de programación (como búsqueda en matrices, árboles, grafos, dynamic programming, etc.), pero en vez de presentarlo con elementos genéricos, lo transformarás para que esté ambientado en Tech Mahindra.

        ### 💼 *Tu tarea es:*

        1.⁠ ⁠*Identificar los elementos clave del problema original*:

          * Entidades (islas, nodos, personas, etc.)
          * Relaciones o interacciones (conexiones, caminos, vecinos, etc.)
          * Recursos (agua, caminos, tiempo, etc.)
          * Objetivo (contar, optimizar, buscar, etc.)

        2.⁠ ⁠*Reemplazar esos elementos por equivalentes dentro del contexto de Tech Mahindra*:

          * Islas → Edificios de Tech Mahindra
          * Agua → Áreas de trabajo, empleados, o zonas de descanso
          * Personas → CEO, directivos, developers de Tech Mahindra
          * Árboles → Jerarquías de proyectos o equipos
          * Grafos → Redes internas, infraestructura de IT
          * Caminos → Flujos de procesos en proyectos de clientes
          * Recursos → Tiempo, presupuesto, servidores, etc.

        3.⁠ ⁠*Redactar el problema reimaginando el escenario como si fuera un reto real de la empresa Tech Mahindra*, manteniendo la esencia lógica intacta.

        El problema original es el siguiente, responde solo con el enunciado reescrito, sin explicaciones adicionales:
        """${statement}"""
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error("Error llamando a Gemini:", error);
      return "Hubo un error al reescribir el enunciado.";
    }
  };

  const handleRewrite = async () => {
    if (!challengeData.question) return;

    setIsGeneratingAi(true);

    try {
      // Save the original text
      setOriginalText(challengeData.question);

      // Get the AI-generated text
      const rewritten = await rewriteStatement(challengeData.question);
      setAiGeneratedText(rewritten);

      // Show the confirmation modal
      setIsAiModalVisible(true);
    } catch (error) {
      console.error("Error generating AI text:", error);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Function to accept AI changes
  const handleAcceptAiChanges = () => {
    setChallengeData((prev) => ({
      ...prev,
      question: aiGeneratedText,
    }));
    setIsAiModalVisible(false);
  };

  // Function to decline AI changes
  const handleDeclineAiChanges = () => {
    setIsAiModalVisible(false);
  };

  useEffect(() => {
    setLoading(true);
    if (userId) {
      //chat aqui no dejen localhost (IMANOL!)
      fetch(`http://142.93.10.227:8080/problems?userId=${userId}`)
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
    }
  }, [refetch, userId]);

  useEffect(() => {
    console.log("Zip file changed:", zipFile);
  }, [zipFile]);

  const fetchProblem = async (problemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/challenge?probID=${problemId}&userID=${user.id}`
      );
      const data = await response.json();
      data.testCases = JSON.parse(data.tests);
      setChallengeData(data);
      return data;
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

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
  };

  const validateForm = () => {
    if (challengeData.title === "" || challengeData.question === "") {
      api.warning({
        message: "Required Fields",
        description: "Please complete all required fields.",
        placement: "topRight",
        duration: 4,
      });
      return false;
    }

    if (
      challengeData.testCases?.some(
        (testCase) => testCase.input === "" || testCase.expectedOutput === ""
      )
    ) {
      api.warning({
        message: "Test Cases Required",
        description:
          "Please do not leave empty fields in the example test cases.",
        placement: "topRight",
        duration: 4,
      });
      return false;
    }
    if (!isEditing && !zipFile) {
      api.warning({
        message: "File Required",
        description: "Please select a zip file.",
        placement: "topRight",
        duration: 4,
      });
      return false;
    }

    return true;
  };

  const handleEditProblem = async () => {
    console.log(challengeData);
    const SampleTests =
      challengeData.testCases != undefined
        ? JSON.stringify(
            challengeData.testCases.map((testCase: any) => ({
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
            }))
          )
        : "[]";
    const data = {
      problem_id: challengeData.problem_id,
      title: challengeData.title,
      difficulty: challengeData.difficulty,
      timeLimit: 5,
      memoryLimit: 256,
      sampleTests: SampleTests,
      question: challengeData.question,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/admin/editProblemStatement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      console.log("Response from server:", res);

      setProblemsData((prevData) =>
        prevData.map((problem) =>
          problem.key === challengeData.problem_id
            ? {
                ...problem,
                title: challengeData.title,
                difficulty: challengeData.difficulty,
                tags: challengeData.tags || ["coding"],
                question: challengeData.question,
              }
            : problem
        )
      );

      api.success({
        message: "Problem Updated",
        description: "The problem was successfully updated.",
        placement: "topRight",
        duration: 4,
      });
    } catch (error) {
      console.error("Error uploading problem statement:", error);
      api.error({
        message: "Update Failed",
        description: "Failed to update the problem. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  const handleUploadTestcases = async (problemId: number) => {
    if (!zipFile) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", zipFile);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/uploadTestcases?problemId=${problemId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const res = await response.json();
      console.log("Response from server:", res);
    } catch (error) {
      console.error("Error uploading test cases:", error);
      api.error({
        message: "Upload Failed",
        description: "Failed to upload test cases. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  const handleUploadProblem = async () => {
    const newProblem = { ...challengeData, key: Date.now().toString() };
    const SampleTests =
      newProblem.testCases != undefined
        ? JSON.stringify(
            newProblem.testCases.map((testCase: any) => ({
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
            }))
          )
        : "[]";

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
      const response = await fetch(
        "http://localhost:8080/admin/uploadProblemStatement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      await handleUploadTestcases(res.problem_id);
      setRefetch(!refetch);

      api.success({
        message: "Problem Created",
        description: "The problem was successfully created.",
        placement: "topRight",
        duration: 4,
      });
    } catch (error) {
      console.error("Error uploading problem statement:", error);
      api.error({
        message: "Creation Failed",
        description: "Failed to create the problem. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  const handleDeleteProblem = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/deleteProblem?problemId=${deletingID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error deleting problem");
      }
      const res = await response.json();
      console.log("Response from server:", res);
      setRefetch(!refetch);

      api.success({
        message: "Problem Deleted",
        description: "The problem was successfully deleted.",
        placement: "topRight",
        duration: 4,
      });
    } catch (error) {
      console.error("Error deleting problem:", error);
      api.error({
        message: "Delete Failed",
        description: "Failed to delete the problem. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setChallengeData({
      title: "",
      difficulty: 1,
      tags: [],
      question: "",
      testCases: [
        {
          input: "",
          expectedOutput: "",
        },
      ],
    });
  };

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
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "40%",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: "20%",
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
      width: "25%",
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      align: "right",
      render: (_: any, record: any) => (
        <div className="flex justify-end gap-3">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              showEditModal(record);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              showDeleteModal(record);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Problems</h1>
        <p className="text-gray-600">Manage and administer platform problems</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Search problems..."
            style={{ width: 250 }}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          label="Add Problem"
        />
      </div>
      <Table
        columns={columns}
        dataSource={problemsData?.filter(
          (problem) =>
            problem.title.toLowerCase().includes(searchText.toLowerCase()) ||
            problem.tags.some((tag) =>
              tag.toLowerCase().includes(searchText.toLowerCase())
            )
        )}
      />
      <Modal
        style={{ marginTop: "-3rem" }}
        title={
          isEditing
            ? "Edit Problem"
            : isDeleting
            ? "Delete Problem"
            : "Add Problem"
        }
        visible={isModalVisible}
        onOk={handleOk}
        disabled={isLoadingSave}
        onCancel={handleCancel}
        okText={isEditing ? "Save" : isDeleting ? "Delete" : "Add"}
        okButtonProps={{ loading: isLoadingSave }}
        cancelText="Cancel"
      >
        {loadingProblem && <p>Loading problem...</p>}
        {!loadingProblem && !isDeleting && (
          <>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              Title
              <Input
                value={challengeData.title}
                onChange={(e: any) => {
                  setChallengeData({ ...challengeData, title: e.target.value });
                }}
                placeholder="Problem title"
              />
            </div>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              Difficulty
              <Select
                placeholder="Select difficulty"
                value={challengeData.difficulty}
                onChange={(value) => {
                  setChallengeData({ ...challengeData, difficulty: value });
                }}
                options={[
                  { value: 1, label: "★☆☆☆☆ Very Easy" },
                  { value: 2, label: "★★☆☆☆ Easy" },
                  { value: 3, label: "★★★☆☆ Medium" },
                  { value: 4, label: "★★★★☆ Hard" },
                  { value: 5, label: "★★★★★ Very Hard" },
                ]}
              />
            </div>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              Tags
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Tags"
                value={challengeData.tags}
                onChange={(value) => {
                  setChallengeData({ ...challengeData, tags: value });
                }}
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
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              Description
              <Input.TextArea
                value={challengeData.question}
                onChange={(e: any) => {
                  setChallengeData({
                    ...challengeData,
                    question: e.target.value,
                  });
                }}
                rows={6}
                placeholder="Problem description"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <Button
                type="primary"
                onClick={handleRewrite}
                loading={isGeneratingAi}
                style={{ marginBottom: "1rem", width: "fit-content" }}
              >
                <FaWandMagicSparkles className="mr-2" />
                Enhance with AI
              </Button>
            </div>
            <div>
              {(challengeData?.testCases || []).map((testCase, index) => (
                <div key={index} className="mb-4 border p-3 rounded-md">
                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <label>Test Input</label>
                    <Input.TextArea
                      rows={2}
                      placeholder="Test input"
                      value={testCase.input}
                      onChange={(e: any) => {
                        const updatedTestCases = [
                          ...(challengeData?.testCases || []),
                        ];
                        updatedTestCases[index] = {
                          ...updatedTestCases[index],
                          input: e.target.value,
                        };
                        setChallengeData({
                          ...challengeData,
                          testCases: updatedTestCases,
                        });
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <label>Test Output</label>
                    <Input.TextArea
                      rows={2}
                      placeholder="Expected output"
                      value={testCase.expectedOutput}
                      onChange={(e: any) => {
                        const updatedTestCases = [
                          ...(challengeData?.testCases || []),
                        ];
                        updatedTestCases[index] = {
                          ...updatedTestCases[index],
                          expectedOutput: e.target.value,
                        };
                        setChallengeData({
                          ...challengeData,
                          testCases: updatedTestCases,
                        });
                      }}
                    />
                  </div>

                  <Button
                    danger
                    onClick={() => {
                      const updatedTestCases = [
                        ...(challengeData?.testCases || []),
                      ];
                      updatedTestCases.splice(index, 1);
                      setChallengeData({
                        ...challengeData,
                        testCases: updatedTestCases,
                      });
                    }}
                  >
                    Delete Test Case
                  </Button>
                </div>
              ))}
              <Button
                style={{ marginBottom: "1rem" }}
                type="dashed"
                onClick={() => {
                  const updatedTestCases = [
                    ...(challengeData?.testCases || []),
                    { input: "", expectedOutput: "" },
                  ];
                  setChallengeData({
                    ...challengeData,
                    testCases: updatedTestCases,
                  });
                }}
                block
              >
                Add Test Case
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
                    Selected file: {zipFile.name}
                  </div>
                )}
                <div className="text-sm text-gray-600 italic mt-2">
                  Make sure the ZIP file contains the test cases in the format:
                  <br />
                  <strong>1.in, 1.out, 2.in, 2.out, ...</strong>
                </div>
              </>
            )}
          </>
        )}
        {isDeleting && (
          <div>
            <p>Are you sure you want to delete this problem?</p>
          </div>
        )}
      </Modal>

      {/* AI Improvement Confirmation Modal */}
      <Modal
        title="AI Improvement Suggestion"
        visible={isAiModalVisible}
        onOk={handleAcceptAiChanges}
        onCancel={handleDeclineAiChanges}
        okText="Accept"
        cancelText="Decline"
        width={800}
      >
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Original Text:</h4>
          <div className="p-3 bg-gray-50 border rounded-md max-h-[200px] overflow-y-auto">
            {originalText}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">AI Improved Text:</h4>
          <div className="p-3 bg-gray-50 border rounded-md max-h-[200px] overflow-y-auto">
            {aiGeneratedText}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Review the AI-generated text above. Click "Accept" to use this
          improved version or "Decline" to keep the original.
        </div>
      </Modal>
    </div>
  );
};

export default Problems;
