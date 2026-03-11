import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useMainStore } from '../../../../src/store/useMainStore';

const HistoryTab = () => {
  const orders = useMainStore((state) => state.orders);
  
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      {completedOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay pedidos completados</Text>
        </View>
      ) : (
        <FlatList
          data={completedOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{item.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.orderTable}>
                {item.tableName || item.customerName || 'Para llevar'}
              </Text>
              <View style={styles.orderItems}>
                {item.items.map((item) => (
                  <Text key={item.id} style={styles.itemText}>
                    {item.quantity}x {item.productName}
                  </Text>
                ))}
              </View>
              <Text style={styles.orderTotal}>Total: ${item.total.toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059432',
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderTable: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  orderItems: {
    gap: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#4b5563',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default HistoryTab;
