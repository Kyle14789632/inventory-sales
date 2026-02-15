import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePurchaseOrderUpdate } from "../../hooks/purchase-orders/usePurchaseOrderUpdate";
import { fetchSupplierOptions } from "../../services/supplier.service";
import { fetchProductOptions } from "../../services/product.service";
import { fetchPurchaseOrderById } from "../../services/purchaseOrder.service";
import PurchaseOrderEditor from "./PurchaseOrderEditor";
import TableLoading from "../../components/TableLoading";

export default function EditPurchaseOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = usePurchaseOrderUpdate();

  const { data: po, isLoading } = useQuery({
    queryKey: ["purchase-order", id],
    queryFn: () => fetchPurchaseOrderById(id),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["supplier-options"],
    queryFn: fetchSupplierOptions,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["product-options"],
    queryFn: fetchProductOptions,
  });

  const [supplierId, setSupplierId] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (po) {
      setSupplierId(po.supplierId);
      setItems(
        po.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          costPrice: item.costPrice,
        })),
      );
    }
  }, [po]);

  if (isLoading) {
    return <TableLoading message="Loading purchase order..." />;
  }

  const isEditable = po.status === "DRAFT";

  const handleSubmit = () => {
    updateMutation.mutate({
      id,
      payload: {
        supplierId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          costPrice: Number(item.costPrice),
        })),
      },
    });
    navigate("/purchase-orders");
  };

  return (
    <PurchaseOrderEditor
      title={`Purchase Order - ${po.poNumber}`}
      status={po.status}
      supplierOptions={suppliers.map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      }))}
      productOptions={products.map((product) => ({
        value: product.id,
        label: product.name,
      }))}
      supplierId={supplierId}
      setSupplierId={setSupplierId}
      items={items}
      setItems={setItems}
      onSubmit={handleSubmit}
      submitting={updateMutation.isPending}
      disabled={!isEditable}
      submitLabel="Update Draft"
    />
  );
}
