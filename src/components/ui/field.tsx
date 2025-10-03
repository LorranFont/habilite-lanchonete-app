import React, { ReactNode } from 'react';
import {View, Text, StyleSheet} from 'react-native';

type FieldProps = {
    label: string;
    error?: string;
    children: ReactNode;
};

export function Field({label, error, children,}: FieldProps) {
    return (
        <View style={styles.container}>
             <Text style={styles.label}>{label}</Text>
            {children}
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    },
    label: {
        color: '#374151',
        marginBottom: 8
    },
    errorText: {
        color: '#DC2626',
        marginTop: 4,
        fontSize: 12
    }
});

export default Field;