import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "CodeChallenge",
    siteDescription: "Competitive programming problem platform",
    language: "en",
    timeZone: "America/New_York",
    defaultTheme: "light"
  });
  
  const [problemSettings, setProblemSettings] = useState({
    defaultTimeLimit: 1000,
    defaultMemoryLimit: 256,
    allowedLanguages: ["C++", "Python", "Java", "JavaScript"],
    maxSubmissionsPerDay: 50,
    judgeTimeout: 10000
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contestReminders: true,
    submissionResults: true,
    rankingUpdates: false,
    marketingEmails: false
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  const handleProblemSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProblemSettings({
      ...problemSettings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage system settings</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "general"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "problems"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("problems")}
            >
              Problems
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "notifications"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "security"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "backups"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("backups")}
            >
              Backups
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">General Settings</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default language
                  </label>
                  <select
                    name="language"
                    value={generalSettings.language}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time zone
                  </label>
                  <select
                    name="timeZone"
                    value={generalSettings.timeZone}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="America/Mexico_City">Mexico City (UTC-6)</option>
                    <option value="Europe/London">London (UTC+0)</option>
                    <option value="Europe/Madrid">Madrid (UTC+1)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default theme
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="light"
                        name="defaultTheme"
                        value="light"
                        checked={generalSettings.defaultTheme === "light"}
                        onChange={handleGeneralChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="light" className="ml-2 block text-sm text-gray-700">
                        Light
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="dark"
                        name="defaultTheme"
                        value="dark"
                        checked={generalSettings.defaultTheme === "dark"}
                        onChange={handleGeneralChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="dark" className="ml-2 block text-sm text-gray-700">
                        Dark
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="system"
                        name="defaultTheme"
                        value="system"
                        checked={generalSettings.defaultTheme === "system"}
                        onChange={handleGeneralChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="system" className="ml-2 block text-sm text-gray-700">
                        System
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "problems" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Problem Settings</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default time limit (ms)
                  </label>
                  <input
                    type="number"
                    name="defaultTimeLimit"
                    value={problemSettings.defaultTimeLimit}
                    onChange={handleProblemSettingChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default memory limit (MB)
                  </label>
                  <input
                    type="number"
                    name="defaultMemoryLimit"
                    value={problemSettings.defaultMemoryLimit}
                    onChange={handleProblemSettingChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum submissions per day
                  </label>
                  <input
                    type="number"
                    name="maxSubmissionsPerDay"
                    value={problemSettings.maxSubmissionsPerDay}
                    onChange={handleProblemSettingChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judge timeout (ms)
                  </label>
                  <input
                    type="number"
                    name="judgeTimeout"
                    value={problemSettings.judgeTimeout}
                    onChange={handleProblemSettingChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed languages
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {["C++", "Java", "Python", "JavaScript", "Go", "Rust", "C#", "Ruby"].map((lang) => (
                    <div key={lang} className="flex items-center">
                      <input
                        type="checkbox"
                        id={lang}
                        checked={problemSettings.allowedLanguages.includes(lang)}
                        onChange={() => {
                          if (problemSettings.allowedLanguages.includes(lang)) {
                            setProblemSettings({
                              ...problemSettings,
                              allowedLanguages: problemSettings.allowedLanguages.filter(l => l !== lang)
                            });
                          } else {
                            setProblemSettings({
                              ...problemSettings,
                              allowedLanguages: [...problemSettings.allowedLanguages, lang]
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={lang} className="ml-2 block text-sm text-gray-700">
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Notification Settings</h2>
              
              <div className="space-y-4">
                {Object.entries({
                  emailNotifications: "Email notifications",
                  contestReminders: "Contest reminders",
                  submissionResults: "Submission results",
                  rankingUpdates: "Ranking updates",
                  marketingEmails: "Marketing emails"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">{label}</h3>
                      <p className="text-xs text-gray-500">
                        {key === "emailNotifications" && "Receive important emails"}
                        {key === "contestReminders" && "Reminders for upcoming contests"}
                        {key === "submissionResults" && "Receive emails with your submission results"}
                        {key === "rankingUpdates" && "Notifications when your ranking changes"}
                        {key === "marketingEmails" && "Receive information about new features and promotions"}
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      onClick={() => handleNotificationChange(key)}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full transition-transform duration-200 ease-in-out transform ${
                          notificationSettings[key] ? "translate-x-6" : "translate-x-0"
                        } ${notificationSettings[key] ? "bg-primary" : "bg-muted"}`}
                      ></span>
                      <span
                        className={`absolute inset-0 rounded-full ${
                          notificationSettings[key] ? "bg-primary/20" : "bg-muted"
                        }`}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password policy
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Standard (8 characters minimum)</option>
                    <option>Strong (lowercase, uppercase, numbers, and symbols)</option>
                    <option>Very strong (12 characters, with complex requirements)</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum session duration (hours)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={24}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="twoFactorAuth" className="text-sm text-gray-700">
                    Enable two-factor authentication for administrators
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="reCaptcha"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="reCaptcha" className="text-sm text-gray-700">
                    Enable reCAPTCHA on public forms
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "backups" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Backup Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Automatic backup frequency
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Do not perform automatic backups</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backup location
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Local storage</option>
                    <option>Amazon S3</option>
                    <option>Google Cloud Storage</option>
                    <option>Microsoft Azure</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum number of backups to retain
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={10}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="encryptBackups"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="encryptBackups" className="text-sm text-gray-700">
                    Encrypt backups
                  </label>
                </div>
                
                <div className="mt-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Create backup now
                  </button>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Recent backups</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">backup_20250405_120000.zip</p>
                          <p className="text-xs text-gray-500">5 April 2025, 12:00 • 15.4 MB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Restore</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">backup_20250404_120000.zip</p>
                          <p className="text-xs text-gray-500">4 April 2025, 12:00 • 15.2 MB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Restore</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">backup_20250403_120000.zip</p>
                          <p className="text-xs text-gray-500">3 April 2025, 12:00 • 15.1 MB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Restore</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;