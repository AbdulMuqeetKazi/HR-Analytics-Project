import { useEffect, useState } from "react";
import { Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { getEmployees, predictEmployee } from "../../services/api";

export function EmployeeProfilesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [predictionData, setPredictionData] = useState<any>({});
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // 🔥 LOAD EMPLOYEES
  useEffect(() => {
    getEmployees()
      .then((res) => {
        console.log("EMPLOYEES API:", res);
        setEmployees(res.employees || []);
      })
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  // 🔍 FIXED FILTER (NO Name field → use ID instead)
  const filteredEmployees = employees.filter((emp) =>
    String(emp["Employee ID"])
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // 🔥 SELECT EMPLOYEE
  const handleSelect = (emp: any) => {
    setShowPrediction(true);

    setPredictionData({
      age: emp.Age,
      yearsAtCompany: emp["Years at Company"],
      monthlyIncome: emp["Monthly Income"],
      promotions: emp["Number of Promotions"],
      distance: emp["Distance from Home"],
      dependents: emp["Number of Dependents"],
      companyTenure: emp["Company Tenure"],
    });
  };

  // 🔥 PREDICT
  const handlePredict = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await predictEmployee({
        Age: Number(predictionData.age),
        "Years at Company": Number(predictionData.yearsAtCompany),
        "Monthly Income": Number(predictionData.monthlyIncome),
        "Number of Promotions": Number(predictionData.promotions),
        "Distance from Home": Number(predictionData.distance),
        "Number of Dependents": Number(predictionData.dependents),
        "Company Tenure": Number(predictionData.companyTenure),
      });

      setPredictionResult(result);
      toast.success("Prediction completed");
    } catch {
      toast.error("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Employee Profiles</h1>

        <button
          onClick={() => setShowPrediction(!showPrediction)}
          className="px-6 py-3 bg-gradient-to-r from-[#4F8CFF] to-[#7B61FF] text-white rounded-xl flex items-center gap-2"
        >
          <Sparkles /> Predict
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABLE */}
        <div className={showPrediction ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-white p-6 rounded-2xl shadow">
            <input
              placeholder="Search by Employee ID..."
              className="w-full p-3 border rounded-xl mb-4"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Age</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Risk</th>
                  <th className="p-2">Score</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((emp, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{emp["Employee ID"]}</td>
                    <td className="p-2">{emp.Age}</td>
                    <td className="p-2">{emp["Job Role"]}</td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          emp.riskLevel === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : emp.riskLevel === "MEDIUM"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {emp.riskLevel}
                      </span>
                    </td>

                    <td className="p-2">
                      {(emp.riskScore * 100).toFixed(1)}%
                    </td>

                    <td>
                      <button onClick={() => handleSelect(emp)}>
                        <Eye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && (
              <p className="text-center py-6 text-gray-500">
                No employees found
              </p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <AnimatePresence>
          {showPrediction && (
            <motion.div className="space-y-6">
              {/* FORM */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Predict Risk
                </h2>

                <form onSubmit={handlePredict} className="space-y-3">
                  {Object.keys(predictionData).map((key) => (
                    <input
                      key={key}
                      type="number"
                      value={predictionData[key]}
                      onChange={(e) =>
                        setPredictionData({
                          ...predictionData,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  ))}

                  <button
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl"
                  >
                    {loading ? "Analyzing..." : "Predict"}
                  </button>
                </form>
              </div>

              {/* RESULT */}
              {predictionResult && (
                <div className="bg-white p-6 rounded-2xl shadow">
                  <h2 className="font-semibold mb-3">Result</h2>

                  <p className="text-4xl font-bold">
                    {predictionResult.risk_score}%
                  </p>

                  <p>{predictionResult.risk_level}</p>
                  <p>
                    Confidence: {predictionResult.confidence}%
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

