import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "CodeChallenge",
    siteDescription: "Plataforma de problemas de programación competitiva",
    language: "es",
    timeZone: "America/Mexico_City",
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
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-gray-600">Administra las configuraciones del sistema</p>
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
                activeTab === "problemas"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("problemas")}
            >
              Problemas
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "notificaciones"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("notificaciones")}
            >
              Notificaciones
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "seguridad"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("seguridad")}
            >
              Seguridad
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
              <h2 className="text-xl font-semibold">Configuración General</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del sitio
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
                    Descripción
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
                    Idioma predeterminado
                  </label>
                  <select
                    name="language"
                    value={generalSettings.language}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona horaria
                  </label>
                  <select
                    name="timeZone"
                    value={generalSettings.timeZone}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="Europe/Madrid">Madrid (UTC+1)</option>
                    <option value="Europe/London">London (UTC+0)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tema predeterminado
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
                        Claro
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
                        Oscuro
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
                        Sistema
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "problemas" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Configuración de Problemas</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Límite de tiempo predeterminado (ms)
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
                    Límite de memoria predeterminado (MB)
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
                    Máximo de envíos por día
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
                    Timeout del juez (ms)
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
                  Lenguajes permitidos
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

          {activeTab === "notificaciones" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Configuración de Notificaciones</h2>
              
              <div className="space-y-4">
                {Object.entries({
                  emailNotifications: "Notificaciones por email",
                  contestReminders: "Recordatorios de concursos",
                  submissionResults: "Resultados de envíos",
                  rankingUpdates: "Actualizaciones de ranking",
                  marketingEmails: "Emails de marketing"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">{label}</h3>
                      <p className="text-xs text-gray-500">
                        {key === "emailNotifications" && "Recibe notificaciones importantes por email"}
                        {key === "contestReminders" && "Notificaciones para concursos próximos"}
                        {key === "submissionResults" && "Recibe emails con los resultados de tus envíos"}
                        {key === "rankingUpdates" && "Notificaciones cuando cambie tu posición en el ranking"}
                        {key === "marketingEmails" && "Recibe información sobre nuevas características y promociones"}
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => handleNotificationChange(key)}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full transition-transform duration-200 ease-in-out transform ${
                          notificationSettings[key] ? "translate-x-6 bg-white" : "translate-x-0 bg-white"
                        } ${notificationSettings[key] ? "bg-blue-600" : "bg-gray-200"}`}
                      ></span>
                      <span
                        className={`absolute inset-0 rounded-full ${
                          notificationSettings[key] ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "seguridad" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Configuración de Seguridad</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Política de contraseñas
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Estándar (8 caracteres mínimo)</option>
                    <option>Fuerte (minúsculas, mayúsculas, números y símbolos)</option>
                    <option>Muy fuerte (12 caracteres, con requisitos complejos)</option>
                    <option>Personalizada</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración máxima de sesión (horas)
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
                    Habilitar autenticación de dos factores para administradores
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
                    Habilitar reCAPTCHA en formularios públicos
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "backups" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Configuración de Backups</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia de backup automático
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Diario</option>
                    <option>Semanal</option>
                    <option>Mensual</option>
                    <option>No realizar backups automáticos</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación de backups
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Almacenamiento local</option>
                    <option>Amazon S3</option>
                    <option>Google Cloud Storage</option>
                    <option>Microsoft Azure</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número máximo de backups a mantener
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
                    Encriptar backups
                  </label>
                </div>
                
                <div className="mt-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Crear backup ahora
                  </button>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Backups recientes</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">backup_20250405_120000.zip</p>
                          <p className="text-xs text-gray-500">5 abril 2025, 12:00 • 15.4 MB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Descargar</button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Restaurar</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">backup_20250404_120000.zip</p>
                          <p className="text-xs text-gray-500">4 abril 2025, 12:00 • 15.2 MB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Descargar</button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Restaurar</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">backup_20250403_120000.zip</p>
                          <p className="text-xs text-gray-500">3 abril 2025, 12:00 • 15.1 MB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Descargar</button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Restaurar</button>
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
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;