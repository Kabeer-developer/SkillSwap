import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBarters,
  updateBarterStatus,
} from "../features/barters/bartersSlice";
import MatchCard from "../components/MatchCard";

function BarterDashboard() {
  const dispatch = useDispatch();
  const { barters } = useSelector((state) => state.barters);

  useEffect(() => {
    dispatch(fetchBarters());
  }, [dispatch]);

  const handleAccept = (id) => {
    dispatch(updateBarterStatus({ id, status: "Accepted" }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Barters</h2>

      <div className="space-y-4">
        {barters.map((barter) => (
          <div key={barter._id}>
            <MatchCard match={barter} />
            {barter.status === "Pending" && (
              <button
                onClick={() => handleAccept(barter._id)}
                className="bg-green-500 text-white px-3 py-1 mt-2"
              >
                Accept
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarterDashboard;