import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { APIHotel } from '@/types';

// Register fonts if needed (using default for now)

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#a8884a', // Heritage gold color
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    yatraName: {
        fontSize: 18,
        color: '#a8884a',
        fontWeight: 'bold',
        marginTop: 4,
    },
    reportType: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    date: {
        fontSize: 10,
        color: '#666',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        minHeight: 40,
        alignItems: 'center',
    },
    col1: { width: '25%', padding: 5 }, // Hotel Name & Details
    col2: { width: '10%', padding: 5, textAlign: 'center' }, // Rooms
    col3: { width: '15%', padding: 5, textAlign: 'right' }, // Advance
    col4: { width: '15%', padding: 5, textAlign: 'right' }, // Total
    col5: { width: '15%', padding: 5, textAlign: 'right' }, // Remaining
    col6: { width: '20%', padding: 5 }, // Manager

    headerText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
    },
    cellText: {
        fontSize: 9,
        color: '#4b5563',
    },
    bold: {
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 10,
        fontSize: 8,
        color: '#9ca3af',
    },
    summarySection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    summaryBox: {
        width: '40%',
        padding: 10,
        backgroundColor: '#f9fafb',
        borderRadius: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 10,
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
    },
});

interface HotelReportPDFProps {
    selectedHotels: APIHotel[];
    yatraName?: string;
}

const HotelReportPDF: React.FC<HotelReportPDFProps> = ({ selectedHotels, yatraName = 'Yatra Management' }) => {
    const totalAdvance = selectedHotels.reduce((sum, h) => sum + (parseFloat(h.advance_paid_amount) || 0), 0);

    const calculateTotalAmount = (hotel: APIHotel) => {
        const baseTotal = hotel.rooms.reduce((sum, room) => sum + (parseFloat(room.charge_per_day) || 0), 0) * (hotel.number_of_days || 1);
        const adjustmentAmount = parseFloat(hotel.adjustment_amount) || 0;
        if (hotel.adjustment_type === 'premium') {
            return baseTotal + adjustmentAmount;
        } else if (hotel.adjustment_type === 'discount') {
            return baseTotal - adjustmentAmount;
        }
        return baseTotal;
    };

    const getBaseTotal = (hotel: APIHotel) => {
        return hotel.rooms.reduce((sum, room) => sum + (parseFloat(room.charge_per_day) || 0), 0) * (hotel.number_of_days || 1);
    };

    const getRoomStats = (rooms: any[]) => {
        const stats: Record<string, { count: number; beds: number; price: number }> = {};

        rooms.forEach(room => {
            const beds = room.number_of_beds || room.numberOfBeds || 0;
            const price = parseFloat(room.charge_per_day || room.chargePerDay) || 0;
            const key = `${beds}-${price}`;

            if (stats[key]) {
                stats[key].count++;
            } else {
                stats[key] = { count: 1, beds, price };
            }
        });

        return Object.values(stats);
    };

    const totalAmount = selectedHotels.reduce((sum, h) => sum + calculateTotalAmount(h), 0);
    const totalRemaining = selectedHotels.reduce((sum, h) => {
        if (h.full_payment_paid) return sum;
        return sum + (calculateTotalAmount(h) - (parseFloat(h.advance_paid_amount) || 0));
    }, 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>Hotel Booking Report</Text>
                        <Text style={styles.yatraName}>{selectedHotels[0]?.yatra?.name || 'Yatra Management'}</Text>
                        {selectedHotels[0]?.yatra && (
                            <Text style={[styles.date, { marginTop: 2 }]}>
                                {new Date(selectedHotels[0].yatra.start_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(selectedHotels[0].yatra.end_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Text>
                        )}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.reportType}>Administrative Use Only</Text>
                        <Text style={styles.date}>Exported: {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <View style={styles.col1}><Text style={styles.headerText}>Hotel Details</Text></View>
                        <View style={styles.col2}><Text style={styles.headerText}>Rooms</Text></View>
                        <View style={styles.col3}><Text style={styles.headerText}>Advance</Text></View>
                        <View style={styles.col4}><Text style={styles.headerText}>Total</Text></View>
                        <View style={styles.col5}><Text style={styles.headerText}>Remaining</Text></View>
                        <View style={styles.col6}><Text style={styles.headerText}>Manager</Text></View>
                    </View>

                    {/* Table Rows */}
                    {selectedHotels.map((hotel, index) => {
                        const hotelTotal = calculateTotalAmount(hotel);
                        const hotelAdvance = parseFloat(hotel.advance_paid_amount) || 0;
                        const hotelRemaining = hotel.full_payment_paid ? 0 : hotelTotal - hotelAdvance;
                        const roomStats = getRoomStats(hotel.rooms);

                        return (
                            <View key={hotel.id} style={styles.tableRow} wrap={false}>
                                <View style={styles.col1}>
                                    <Text style={[styles.cellText, styles.bold]}>{hotel.name}</Text>
                                    <Text style={[styles.cellText, { color: '#666', fontSize: 7 }]}>{hotel.address}</Text>

                                    {/* Room Stats */}
                                    <View style={{ marginTop: 2 }}>
                                        {roomStats.map((stat: any, idx: number) => (
                                            <Text key={idx} style={{ fontSize: 7, color: '#4b5563' }}>
                                                • {stat.count} Rooms ({stat.beds} Beds @ ₹{stat.price.toLocaleString()})
                                            </Text>
                                        ))}
                                    </View>

                                    {/* Adjustment Details & Comment in PDF */}
                                    {(parseFloat(hotel.adjustment_amount) || 0) > 0 && (
                                        <View style={{ marginTop: 2 }}>
                                            <Text style={{ fontSize: 7, fontStyle: 'italic', fontWeight: 'bold', color: hotel.adjustment_type === 'premium' ? '#a8884a' : '#8a1b1b' }}>
                                                {hotel.adjustment_type === 'premium' ? 'Extra Charge' : 'Discount Given'}: {hotel.adjustment_type === 'premium' ? '+' : '-'}₹{(parseFloat(hotel.adjustment_amount) || 0).toLocaleString()}
                                            </Text>
                                            {hotel.payment_comment && (
                                                <Text style={{ fontSize: 7, color: '#6b7280', marginTop: 1, fontStyle: 'italic' }}>
                                                    * {hotel.payment_comment}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                                <View style={styles.col2}>
                                    <Text style={styles.cellText}>{hotel.total_rooms}</Text>
                                </View>
                                <View style={styles.col3}>
                                    <Text style={styles.cellText}>₹{hotelAdvance.toLocaleString()}</Text>
                                </View>
                                <View style={styles.col4}>
                                    {parseFloat(hotel.adjustment_amount) > 0 ? (
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 7, color: '#6b7280' }}>₹{getBaseTotal(hotel).toLocaleString()}</Text>
                                            <Text style={{ fontSize: 7, fontWeight: 'bold', color: hotel.adjustment_type === 'premium' ? '#a8884a' : '#8a1b1b' }}>
                                                {hotel.adjustment_type === 'premium' ? '+' : '-'}₹{parseFloat(hotel.adjustment_amount).toLocaleString()}
                                            </Text>
                                            <View style={{ borderTopWidth: 0.5, borderTopColor: '#e5e7eb', marginTop: 1, paddingTop: 1 }}>
                                                <Text style={[styles.cellText, styles.bold]}>₹{hotelTotal.toLocaleString()}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={styles.cellText}>₹{hotelTotal.toLocaleString()}</Text>
                                    )}
                                </View>
                                <View style={styles.col5}>
                                    <Text style={[styles.cellText, styles.bold, { color: hotelRemaining > 0 ? '#dc2626' : '#059669' }]}>
                                        ₹{hotelRemaining.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.col6}>
                                    <Text style={styles.cellText}>{hotel.manager_name}</Text>
                                    <Text style={[styles.cellText, { color: '#666', fontSize: 8 }]}>{hotel.manager_contact}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Summary Section */}
                <View style={styles.summarySection} wrap={false}>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Advance:</Text>
                            <Text style={styles.summaryValue}>₹{totalAdvance.toLocaleString()}</Text>
                        </View>
                        
                        {/* Breakdown of Adjustments in Summary */}
                        {selectedHotels.some(h => parseFloat(h.adjustment_amount) > 0) && (
                            <View style={{ borderTopWidth: 0.5, borderTopColor: '#e5e7eb', marginTop: 5, paddingTop: 5 }}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Total Base Amount:</Text>
                                    <Text style={styles.summaryValue}>₹{selectedHotels.reduce((sum, h) => sum + getBaseTotal(h), 0).toLocaleString()}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Net Adjustments:</Text>
                                    <Text style={[styles.summaryValue, { color: '#a8884a' }]}>
                                        ₹{selectedHotels.reduce((sum, h) => {
                                            const amt = parseFloat(h.adjustment_amount) || 0;
                                            return sum + (h.adjustment_type === 'premium' ? amt : -amt);
                                        }, 0).toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 5, paddingTop: 5 }]}>
                            <Text style={[styles.summaryLabel, styles.bold]}>Grand Total:</Text>
                            <Text style={[styles.summaryValue, styles.bold]}>₹{totalAmount.toLocaleString()}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, styles.bold]}>Net Remaining:</Text>
                            <Text style={[styles.summaryValue, { color: '#dc2626' }]}>₹{totalRemaining.toLocaleString()}</Text>
                        </View>

                    </View>
                </View>

                {/* Footer */}
                <Text
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) => (
                        `This is a computer-generated document. Page ${pageNumber} / ${totalPages}`
                    )}
                    fixed
                />
            </Page>
        </Document>
    );
};

export default HotelReportPDF;
