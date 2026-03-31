import { 
  BarChart3, 
  Activity, 
  Smile, 
  PieChart, 
  Filter, 
  Calendar
} from "lucide-react"

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const dashboards = [
    { id: "navigator", name: "Market Navigator", icon: BarChart3 },
    { id: "breadth", name: "Market Breadth", icon: Activity },
    { id: "sentiment", name: "Market Sentiment", icon: Smile },
    { id: "sectors", name: "Industry Groups", icon: PieChart },
  ];

  const tools = [
    { id: "screener", name: "Stock Screener", icon: Filter },
    { id: "calendar", name: "Calendar", icon: Calendar },
  ];

  return (
    <div className="w-64 border-r border-border h-screen flex flex-col bg-card/50">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
          <Activity className="h-6 w-6" />
          MarketLens IN
        </h1>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Dashboards
        </div>
        
        <nav className="space-y-1">
          {dashboards.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                activeTab === item.id 
                  ? "bg-secondary text-secondary-foreground font-medium" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Tools
        </div>
        
        <nav className="space-y-1">
          {tools.map((item) => (
             <button
             key={item.id}
             onClick={() => setActiveTab(item.id)}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
               activeTab === item.id 
                 ? "bg-secondary text-secondary-foreground font-medium" 
                 : "hover:bg-muted text-muted-foreground hover:text-foreground"
             }`}
           >
             <item.icon className="h-4 w-4" />
             {item.name}
           </button>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="text-sm text-muted-foreground text-center">
          Powered by NSE Data
        </div>
      </div>
    </div>
  )
}
