import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchSalesOrderById } from "../../services/salesOrder.service";
import { fetchCustomerOptions } from "../../services/customer.service";
import { fetchProductOptions } from "../../services/product.service";
import { useSalesOrderUpdate } from "../../hooks/sales-orders/useSalesOrderUpdate";
import SalesOrderEditor from "./SalesOrderEditor";
import TableLoading from "../../components/TableLoading";


export default function EditSalesOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useSalesOrderUpdate();

  const { data: so, isLoading } = useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => fetchSalesOrderById(id),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customer-options"],
    queryFn: fetchCustomerOptions,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["product-options"],
    queryFn: fetchProductOptions,
  });

  const [customerId, setCustomerId] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (so) {
      setCustomerId(so.customerId);
      setItems(
        so.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          sellingPrice: i.sellingPrice,
        })),
      );
    }
  }, [so]);

  if (isLoading) {
    return <TableLoading message="Loading sales order..." />;
  }

  const isEditable = so.status === "DRAFT";

  const submit = () => {
    updateMutation.mutate({
      id,
      payload: {
        customerId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
          sellingPrice: Number(i.sellingPrice),
        })),
      },
    });
    navigate("/sales-orders");
  };

  return (
    <SalesOrderEditor
      title={`Sales Order • ${so.soNumber}`}
      status={so.status}
      customerOptions={customers.map((c) => ({
        value: c.id,
        label: c.name,
      }))}
      productOptions={products.map((p) => ({
        value: p.id,
        label: p.name,
      }))}
      customerId={customerId}
      setCustomerId={setCustomerId}
      items={items}
      setItems={setItems}
      onSubmit={submit}
      submitting={updateMutation.isPending}
      disabled={!isEditable}
      submitLabel="Update Draft"
    />
  );
}
