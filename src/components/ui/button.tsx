import react from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  Loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  Loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
    const isDisabled = Loading || disabled;

    const base = 
        "mt-6 rounded-2xl px-4 py-3 border border-gray-300 active:opacity-80 items-center justify-center";
    const variants = {
        primary: isDisabled
            ? "bg-gray-400"
            : "bg-habilite-accent",
        outline: 
        "border border-gray-300 bg-white",
    };

    return (
        <Pressable
            className={`${base} ${variants[variant]} ${className}`}
            onPress={onPress}
            disabled={isDisabled}
        >
            {Loading ? (
                <ActivityIndicator color={variant === 'outline' ? "#111827" : "#fff"} />
            ) : (
                <Text className={variant === 'outline' ? "text-habilite-primary font-semibold" : "text-black font-bold"}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

export default Button;