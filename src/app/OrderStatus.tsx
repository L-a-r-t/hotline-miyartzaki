export default function OrderStatusBadge({ status }: { status: string }) {
  const statusLookup = {
    pending: {
      text: "En attente de paiement",
      color: "bg-yellow-500 text-white",
    },
    preparation: { text: "Acceptée", color: "bg-green-500 text-white" },
    delivered: { text: "Livrée", color: "bg-blue-500 text-white" },
    cancelled: { text: "Annulée", color: "bg-red-500 text-white" },
  } as Record<string, any>

  return (
    <p
      className={`${statusLookup[status].color} px-2 py-1 rounded text-sm font-medium inline`}
    >
      {statusLookup[status].text}
    </p>
  )
}
