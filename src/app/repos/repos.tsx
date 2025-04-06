import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import { Octokit } from "@octokit/rest";
import {
  Search,
  Star,
  Code,
  AlertCircle,
  CheckCircle,
  BarChart,
  RefreshCw,
} from "lucide-react";

// Assume this function fetches the user's profile
const getUserProfile = async () => {
  // This is a mock implementation
  return { username: "fermofou" };
};

// SonarQube API functions
const sonarQubeBaseUrl = "http://localhost:9000";

const checkSonarQubeProject = async (projectKey: string) => {
  try {
    const response = await fetch(
      `${sonarQubeBaseUrl}/api/projects/search?projects=${projectKey}`
    );
    const data = await response.json();
    return data.components && data.components.length > 0;
  } catch (error) {
    console.error("Error checking SonarQube project:", error);
    return false;
  }
};

const fetchSonarQubeMetrics = async (projectKey: string) => {
  try {
    const response = await fetch(
      `${sonarQubeBaseUrl}/api/measures/component?component=${projectKey}&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density`
    );
    const data = await response.json();

    if (!data.component) {
      return null;
    }

    // Transform the measures array into an object for easier access
    const metrics = {};
    data.component.measures.forEach((measure : any) => {
      metrics[measure.metric] = measure.value;
    });

    return metrics;
  } catch (error) {
    console.error("Error fetching SonarQube metrics:", error);
    return null;
  }
};

const runSonarQubeScan = async (projectKey: string) => {
  // In a real implementation, this would trigger a CI/CD pipeline or webhook
  // For demo purposes, we'll just simulate a successful scan
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 2000);
  });
};

interface Repository {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  sonarQubeStatus?: {
    exists: boolean;
    metrics?: any;
    lastScan?: string;
  };
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: Repository | null;
  onProjectCreated: () => void;
}

const SonarQubeSetupModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  repository,
  onProjectCreated,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectKey, setProjectKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (repository) {
      // Generate a default project key based on the repo name
      setProjectKey(
        `${repository.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
      );
    }
  }, [repository]);

  if (!isOpen || !repository) return null;

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    // In a real implementation, this would create the project in SonarQube
    // For now, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    onProjectCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Setup SonarQube for {repository.name}
        </h2>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-blue-500 text-white"
                      : currentStep > step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep > step ? "✓" : step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-12 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Access SonarQube</h3>
              <p className="mb-4">
                First, make sure you have access to your SonarQube instance.
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>
                  Open your SonarQube instance at{" "}
                  <a
                    href={sonarQubeBaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {sonarQubeBaseUrl}
                  </a>
                </li>
                <li>Log in with your administrator credentials</li>
                <li>Navigate to "Projects" in the top menu</li>
              </ol>
              <div className="border p-4 rounded-md bg-blue-50 text-blue-700 mb-4">
                <p>
                  <strong>Note:</strong> Make sure your SonarQube instance is
                  running and accessible from your current network.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Create a New Project
              </h3>
              <p className="mb-4">
                Now, let's set up your project in SonarQube.
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Click on "Create Project" in the SonarQube UI</li>
                <li>Choose "Manually" option</li>
                <li>
                  Enter a Project Key (this will be used to identify your
                  project)
                </li>
                <li>
                  Enter a Display Name (usually the same as your repository
                  name)
                </li>
              </ol>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Suggested Project Key:
                </label>
                <input
                  type="text"
                  value={projectKey}
                  onChange={(e) => setProjectKey(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This key must be unique in your SonarQube instance
                </p>
              </div>

              <div className="border p-4 rounded-md bg-yellow-50 text-yellow-700">
                <p>
                  <strong>Tip:</strong> Keep the project key simple, using only
                  lowercase letters, numbers, and underscores.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Configure Analysis</h3>
              <p className="mb-4">Finally, set up your project for analysis.</p>

              <div className="bg-gray-50 p-4 rounded-md mb-4 font-mono text-sm">
                <p># Add to your package.json scripts:</p>
                <p className="mt-2">"scripts": {"{"}</p>
                <p className="ml-4">
                  "sonar": "sonar-scanner -Dsonar.projectKey={projectKey}{" "}
                  -Dsonar.sources=. -Dsonar.host.url={sonarQubeBaseUrl}"
                </p>
                <p>{"}"}</p>
              </div>

              <p className="mb-4">
                Or add a sonar-project.properties file to your repository root:
              </p>

              <div className="bg-gray-50 p-4 rounded-md mb-4 font-mono text-sm">
                <p>sonar.projectKey={projectKey}</p>
                <p>sonar.projectName={repository.name}</p>
                <p>sonar.sources=.</p>
                <p>sonar.host.url={sonarQubeBaseUrl}</p>
              </div>

              <div className="border p-4 rounded-md bg-green-50 text-green-700">
                <p>
                  <strong>Next steps:</strong> After completing this setup, run
                  your first analysis with 'npm run sonar' or by using the
                  SonarQube scanner directly.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Completing..." : "Complete Setup"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface SonarMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: Repository | null;
  onRunScan: (repo: Repository) => void;
}

const SonarMetricsModal: React.FC<SonarMetricsModalProps> = ({
  isOpen,
  onClose,
  repository,
  onRunScan,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !repository || !repository.sonarQubeStatus?.metrics)
    return null;

  const metrics = repository.sonarQubeStatus.metrics;

  const handleRunScan = async () => {
    setLoading(true);
    await onRunScan(repository);
    setLoading(false);
  };

  // Helper function to determine metric status color
  const getMetricColor = (metric : any, value : any) => {
    const numValue = parseFloat(value);
    switch (metric) {
      case "bugs":
      case "vulnerabilities":
      case "code_smells":
        return numValue === 0
          ? "text-green-600"
          : numValue < 5
          ? "text-yellow-600"
          : "text-red-600";
      case "coverage":
        return numValue > 80
          ? "text-green-600"
          : numValue > 60
          ? "text-yellow-600"
          : "text-red-600";
      case "duplicated_lines_density":
        return numValue < 3
          ? "text-green-600"
          : numValue < 10
          ? "text-yellow-600"
          : "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            SonarQube Analysis: {repository.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-500">
            Last scan: {repository.sonarQubeStatus?.lastScan || "Unknown"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div
                className={`text-4xl font-bold ${getMetricColor(
                  "bugs",
                  metrics.bugs
                )}`}
              >
                {metrics.bugs || "0"}
              </div>
              <div className="text-gray-600 mt-2">Bugs</div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div
                className={`text-4xl font-bold ${getMetricColor(
                  "vulnerabilities",
                  metrics.vulnerabilities
                )}`}
              >
                {metrics.vulnerabilities || "0"}
              </div>
              <div className="text-gray-600 mt-2">Vulnerabilities</div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div
                className={`text-4xl font-bold ${getMetricColor(
                  "code_smells",
                  metrics.code_smells
                )}`}
              >
                {metrics.code_smells || "0"}
              </div>
              <div className="text-gray-600 mt-2">Code Smells</div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div
                className={`text-4xl font-bold ${getMetricColor(
                  "coverage",
                  metrics.coverage
                )}`}
              >
                {metrics.coverage || "0"}%
              </div>
              <div className="text-gray-600 mt-2">Coverage</div>
            </div>

            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div
                className={`text-4xl font-bold ${getMetricColor(
                  "duplicated_lines_density",
                  metrics.duplicated_lines_density
                )}`}
              >
                {metrics.duplicated_lines_density || "0"}%
              </div>
              <div className="text-gray-600 mt-2">Duplication</div>
            </div>

            <div className="border rounded-lg p-4 flex items-center justify-center">
              <button
                onClick={handleRunScan}
                disabled={loading}
                className={`flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full h-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                {loading ? "Scanning..." : "Re-run Scan"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={`${sonarQubeBaseUrl}/dashboard?id=${repository.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "_")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <BarChart className="h-4 w-4 mr-1" />
            View full report in SonarQube
          </a>
        </div>
      </div>
    </div>
  );
};

export default function ReposPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // SonarQube related states
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const profile = await getUserProfile();
        setUsername(profile.username);
        const octokit = new Octokit();

        const { data } = await octokit.repos.listForUser({
          username: profile.username,
          type: "owner",
          sort: "updated",
          per_page: 100,
        });

        // Check SonarQube status for each repository
        const reposWithSonarStatus = await Promise.all(
          (data as Repository[]).map(async (repo) => {
            const projectKey = repo.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "_");
            const exists = await checkSonarQubeProject(projectKey);

            let metrics = null;
            if (exists) {
              metrics = await fetchSonarQubeMetrics(projectKey);
            }

            return {
              ...repo,
              sonarQubeStatus: {
                exists,
                metrics,
                lastScan: exists ? new Date().toLocaleString() : null,
              },
            };
          })
        );

        setRepos(reposWithSonarStatus);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch repositories");
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenSetupModal = (repo: Repository) => {
    setSelectedRepo(repo);
    setIsSetupModalOpen(true);
  };

  const handleOpenMetricsModal = (repo: Repository) => {
    setSelectedRepo(repo);
    setIsMetricsModalOpen(true);
  };

  const handleProjectCreated = async () => {
    if (!selectedRepo) return;

    // Update the repository's SonarQube status
    const updatedRepos = repos.map((repo) => {
      if (repo.id === selectedRepo.id) {
        return {
          ...repo,
          sonarQubeStatus: {
            exists: true,
            metrics: {
              bugs: "0",
              vulnerabilities: "0",
              code_smells: "0",
              coverage: "0",
              duplicated_lines_density: "0",
            },
            lastScan: new Date().toLocaleString(),
          },
        };
      }
      return repo;
    });

    setRepos(updatedRepos);
  };

  const handleRunScan = async (repository: Repository) => {
    // Run a SonarQube scan
    const projectKey = repository.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    await runSonarQubeScan(projectKey);

    // Fetch updated metrics
    const metrics = await fetchSonarQubeMetrics(projectKey);

    // Update repository data
    const updatedRepos = repos.map((repo) => {
      if (repo.id === repository.id) {
        return {
          ...repo,
          sonarQubeStatus: {
            ...repo.sonarQubeStatus,
            metrics: metrics || repo.sonarQubeStatus?.metrics,
            lastScan: new Date().toLocaleString(),
          },
        };
      }
      return repo;
    });

    setRepos(updatedRepos);

    // Update the selected repo if it's currently being viewed
    if (selectedRepo && selectedRepo.id === repository.id) {
      setSelectedRepo({
        ...repository,
        sonarQubeStatus: {
          ...repository.sonarQubeStatus,
          metrics: metrics || repository.sonarQubeStatus?.metrics,
          lastScan: new Date().toLocaleString(),
        },
      });
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-2">
            Public GitHub Repositories
          </h1>
          <h2 className="text-xl text-gray-600 mb-8">for {username}</h2>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search repositories..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {repo.name}
                  </a>
                </h2>
                <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                  {repo.description || "No description"}
                </p>

                {/* SonarQube Status Section */}
                <div className="mb-4 py-2 border-t border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {repo.sonarQubeStatus?.exists ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className="text-sm">
                        {repo.sonarQubeStatus?.exists
                          ? "SonarQube Enabled"
                          : "SonarQube Not Configured"}
                      </span>
                    </div>

                    {repo.sonarQubeStatus?.exists ? (
                      <button
                        onClick={() => handleOpenMetricsModal(repo)}
                        className="text-sm text-blue-500 hover:underline flex items-center"
                      >
                        <BarChart className="h-4 w-4 mr-1" />
                        View Results
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenSetupModal(repo)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Set Up Now
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-1" />
                    <span>{repo.language || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRepos.length === 0 && (
            <p className="text-center mt-8 text-gray-500">
              No repositories found.
            </p>
          )}
        </main>
      </div>

      {/* SonarQube Setup Modal */}
      <SonarQubeSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        repository={selectedRepo}
        onProjectCreated={handleProjectCreated}
      />

      {/* SonarQube Metrics Modal */}
      <SonarMetricsModal
        isOpen={isMetricsModalOpen}
        onClose={() => setIsMetricsModalOpen(false)}
        repository={selectedRepo}
        onRunScan={handleRunScan}
      />
    </div>
  );
}
