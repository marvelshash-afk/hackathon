import { notificationService } from "@/service/notificationService"

export default function TestAttack() {

  const triggerAttack = () => {

    notificationService.sendAttackAlert({
      id: "test_001",
      attackType: "DDoS Attack",
      severity: "high",
      timestamp: new Date().toISOString(),
      sourceIP: "192.168.1.45",
      targetEndpoint: "/login",
      details: { attempts: 500 },
      country: "Russia"
    })

  }

  return (
    <button
      onClick={triggerAttack}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Simulate Attack
    </button>
  )
}