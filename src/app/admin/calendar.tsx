import { useState, useEffect } from "react";
import { Calendar, Badge, Tooltip, Card, Tabs, Button, Tag } from "antd";
import { CodeOutlined, TrophyOutlined, TeamOutlined, FireOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const CalendarTab = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarView, setCalendarView] = useState("month");
  
  // Datos dummy para simular eventos
  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      const dummyEvents = [
        {
          id: 1,
          title: "Contest Semanal #42",
          date: new Date(2025, 3, 8), // 8 de abril 2025
          type: "contest",
          difficulty: "Intermedio",
          duration: "2 horas",
          participants: 124
        },
        {
          id: 2,
          title: "Algoritmos de Gráficos - Práctica",
          date: new Date(2025, 3, 10), // 10 de abril 2025
          type: "practice",
          difficulty: "Difícil",
          problems: 6
        },
        {
          id: 3,
          title: "Maratón de Programación",
          date: new Date(2025, 3, 15), // 15 de abril 2025
          type: "contest",
          difficulty: "Avanzado",
          duration: "5 horas",
          participants: 256
        },
        {
          id: 4,
          title: "Sesión de Problemas Dinámicos",
          date: new Date(2025, 3, 20), // 20 de abril 2025
          type: "practice",
          difficulty: "Intermedio",
          problems: 4
        },
        {
          id: 5,
          title: "Contest Empresarial - Google",
          date: new Date(2025, 3, 25), // 25 de abril 2025
          type: "contest",
          difficulty: "Intermedio-Avanzado",
          duration: "3 horas",
          participants: 310
        }
      ];
      
      setEvents(dummyEvents);
      setLoading(false);
    }, 800);
  }, []);

  // Función para obtener datos para el calendario
  const getListData = (value) => {
    return events.filter(event => 
      value.date() === event.date.getDate() && 
      value.month() === event.date.getMonth() && 
      value.year() === event.date.getFullYear()
    );
  };

  // Renderizado de celdas del calendario
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.id}>
            <Tooltip title={item.title}>
              <Badge 
                color={item.type === "contest" ? "#1890ff" : "#52c41a"} 
                text={
                  <span className="truncate inline-block max-w-full">
                    {item.title.length > 15 ? `${item.title.substring(0, 13)}...` : item.title}
                  </span>
                } 
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  // Manejo de selección de fecha
  const onSelect = (date) => {
    setSelectedDate(date.toDate());
  };
  
  // Renderizado de eventos para la fecha seleccionada
  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    
    const dateEvents = events.filter(event => 
      selectedDate.getDate() === event.date.getDate() && 
      selectedDate.getMonth() === event.date.getMonth() && 
      selectedDate.getFullYear() === event.date.getFullYear()
    );
    
    if (dateEvents.length === 0) {
      return (
        <div className="text-center p-4">
          <p>No hay eventos programados para esta fecha.</p>
          <Button type="primary" className="mt-2">Crear Nuevo Evento</Button>
        </div>
      );
    }
    
    return (
      <div>
        {dateEvents.map(event => (
          <Card key={event.id} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{event.title}</h3>
              <Tag color={event.type === "contest" ? "blue" : "green"}>
                {event.type === "contest" ? "Concurso" : "Práctica"}
              </Tag>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center">
                <FireOutlined className="mr-1" />
                <span>Dificultad: {event.difficulty}</span>
              </div>
              
              {event.duration && (
                <div className="flex items-center ml-4">
                  <ClockCircleOutlined className="mr-1" />
                  <span>Duración: {event.duration}</span>
                </div>
              )}
              
              {event.participants && (
                <div className="flex items-center ml-4">
                  <TeamOutlined className="mr-1" />
                  <span>Participantes: {event.participants}</span>
                </div>
              )}
              
              {event.problems && (
                <div className="flex items-center ml-4">
                  <CodeOutlined className="mr-1" />
                  <span>Problemas: {event.problems}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button type="primary">
                {event.type === "contest" ? "Registrarse" : "Practicar Ahora"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Cambio de vista del calendario
  const handleViewChange = (view) => {
    setCalendarView(view);
  };

  return (
    <div className="w-full">
      <Card className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Calendario de Eventos</h2>
          <div>
            <Button.Group>
              <Button 
                type={calendarView === "month" ? "primary" : "default"}
                onClick={() => handleViewChange("month")}
              >
                Mes
              </Button>
              <Button 
                type={calendarView === "year" ? "primary" : "default"}
                onClick={() => handleViewChange("year")}
              >
                Año
              </Button>
            </Button.Group>
          </div>
        </div>
        
        <Tabs defaultActiveKey="1">
          <TabPane tab={
            <span>
              <TrophyOutlined />
              Todos los Eventos
            </span>
          } key="1">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-8/12">
                <Calendar 
                  dateCellRender={dateCellRender} 
                  onSelect={onSelect}
                  mode={calendarView}
                  loading={loading}
                />
              </div>
              <div className="w-full lg:w-4/12">
                <Card 
                  title={selectedDate ? `Eventos para ${selectedDate.toLocaleDateString()}` : "Seleccione una fecha"}
                  className="sticky top-4"
                >
                  {renderSelectedDateEvents()}
                </Card>
              </div>
            </div>
          </TabPane>
          <TabPane tab={
            <span>
              <CodeOutlined />
              Concursos
            </span>
          } key="2">
            <div className="p-4 text-center">
              <p>Filtro para ver solo concursos.</p>
            </div>
          </TabPane>
          <TabPane tab={
            <span>
              <FireOutlined />
              Prácticas
            </span>
          } key="3">
            <div className="p-4 text-center">
              <p>Filtro para ver solo sesiones de práctica.</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>
      
      <Card title="Próximos Eventos Destacados">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events
            .filter(event => event.date >= new Date())
            .slice(0, 3)
            .map(event => (
              <Card key={event.id} size="small" className="border-t-2" style={{ borderTopColor: event.type === "contest" ? "#1890ff" : "#52c41a" }}>
                <div className="flex items-center mb-2">
                  {event.type === "contest" ? <TrophyOutlined className="mr-2 text-blue-500" /> : <CodeOutlined className="mr-2 text-green-500" />}
                  <h3 className="font-medium">{event.title}</h3>
                </div>
                <p className="text-gray-600">
                  <ClockCircleOutlined className="mr-1" />
                  {event.date.toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">{event.type === "contest" ? `${event.duration} • Participantes: ${event.participants}` : `${event.problems} problemas • ${event.difficulty}`}</p>
              </Card>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default CalendarTab;