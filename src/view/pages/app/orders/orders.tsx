import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { z } from "zod";

import { getOrders } from "@/app/services/orders";

import { Pagination } from "@/view/components/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/view/components/ui/table";

import { OrderTableRow } from "./orders-table-row";
import { OrdersTableFilters } from "./orders-table-filters";
import { OrdersTableSkeleton } from "./order-table-skeleton";

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");
  const customerName = searchParams.get("customerName");
  const status = searchParams.get("status");

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("pageIndex") ?? "1");

  const { data: result, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders", pageIndex, orderId, customerName, status],
    queryFn: () => {
      return getOrders({
        pageIndex,
        orderId,
        customerName,
        status: status === "all" ? null : status,
      });
    },
  });

  function handlePaginate(page: number) {
    setSearchParams((prevState) => {
      prevState.set("pageIndex", String(page + 1));

      return prevState;
    });
  }

  return (
    <>
      <Helmet title="Pedidos" />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>

        <div className="space-y-2.5">
          <OrdersTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Realizado há</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[140px]">Total do pedido</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoadingOrders && <OrdersTableSkeleton />}

                {result &&
                  result.orders.map((order) => {
                    return <OrderTableRow key={order.orderId} order={order} />;
                  })}
              </TableBody>
            </Table>
          </div>

          {result && (
            <Pagination
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  );
}
