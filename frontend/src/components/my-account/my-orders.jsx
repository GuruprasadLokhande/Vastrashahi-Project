import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { useCancelOrderMutation, useReturnOrderMutation } from "@/redux/features/orderApi";
import { toast } from "react-toastify";

const MyOrders = ({ orderData }) => {
  const order_items = orderData?.orders;
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: isReturning }] = useReturnOrderMutation();
  const [returnReason, setReturnReason] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderId).unwrap();
        toast.success("Order cancelled successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to cancel order. Please try again.");
      }
    }
  };

  // Handle order return
  const handleReturnOrder = async () => {
    if (!returnReason.trim()) {
      toast.error("Please provide a reason for return");
      return;
    }

    try {
      await returnOrder({
        orderId: selectedOrderId,
        reason: returnReason
      }).unwrap();
      toast.success("Return request submitted successfully");
      setShowReturnModal(false);
      setReturnReason("");
      setSelectedOrderId(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit return request. Please try again.");
    }
  };

  // Open return modal
  const openReturnModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowReturnModal(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "badge bg-success";
      case "Cancelled":
        return "badge bg-danger";
      case "Return Requested":
      case "Returned":
        return "badge bg-warning";
      case "Processing":
        return "badge bg-info";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <>
      <div className="profile__ticket table-responsive">
        {!order_items || order_items?.length === 0 ? (
          <div className="text-center p-4">
            <i className="fas fa-shopping-bag fa-3x mb-3 text-muted"></i>
            <p className="mb-0">No orders found</p>
            <Link href="/shop" className="tp-btn-2 btn-primary mt-3">
              Start Shopping
            </Link>
          </div>
        ) : (
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {order_items.map((item) => (
                <tr key={item._id}>
                  <td>#{item._id.substring(20, 25)}</td>
                  <td>{dayjs(item.createdAt).format("MMM D, YYYY")}</td>
                  <td>
                    <span className={getStatusBadgeClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link 
                        href={`/order/${item._id}`} 
                        className="invoice-btn"
                      >
                        <i className="fas fa-file-invoice me-1"></i> Invoice
                      </Link>
                      
                      {item.status !== "Delivered" && item.status !== "Cancelled" && (
                        <button
                          onClick={() => handleCancelOrder(item._id)}
                          className="text-danger border-0 bg-transparent"
                          disabled={isCancelling}
                        >
                          Cancel
                        </button>
                      )}

                      {item.status === "Delivered" && !item.isReturned && (
                        <button
                          onClick={() => openReturnModal(item._id)}
                          className="tp-btn-2 btn-sm btn-warning"
                          disabled={isReturning}
                        >
                          <i className="fas fa-undo me-1"></i> Return
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="return-modal">
          <div className="return-modal-content p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Return Order</h4>
              <button
                className="btn-close"
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                  setSelectedOrderId(null);
                }}
              ></button>
            </div>
            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Please provide a reason for return"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            ></textarea>
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="tp-btn-2 btn-secondary"
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                  setSelectedOrderId(null);
                }}
                disabled={isReturning}
              >
                Cancel
              </button>
              <button
                className="tp-btn-2 btn-primary"
                onClick={handleReturnOrder}
                disabled={isReturning}
              >
                {isReturning ? "Submitting..." : "Submit Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .return-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .return-modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .tp-btn-2 {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-sm {
          padding: 6px 12px;
          font-size: 14px;
        }
        .btn-primary {
          background-color: #3577f0;
          color: white;
        }
        .btn-danger {
          background-color: #dc3545;
          color: white;
        }
        .btn-warning {
          background-color: #ffc107;
          color: black;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        .btn-primary:disabled,
        .btn-danger:disabled,
        .btn-warning:disabled,
        .btn-secondary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .badge {
          padding: 6px 10px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 12px;
        }
        .invoice-btn {
          background-color: #FFE3D8;
          color: #000;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        .invoice-btn:hover {
          background-color: #ffd1c1;
          color: #000;
        }
      `}</style>
    </>
  );
};

export default MyOrders;
