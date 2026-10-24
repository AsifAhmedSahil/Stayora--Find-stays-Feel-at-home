import { useState, type ComponentProps } from "react";
import { Pressable } from "react-native";
import { Icon, TextField } from "@/components/ui";

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, "secureTextEntry" | "trailing">;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      variant="filled"
      leadingIcon="lock"
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={!visible}
      trailing={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? "Hide password" : "Show password"}
          onPress={() => setVisible(!visible)}
          className="-mr-3 h-12 w-12 items-center justify-center active:opacity-60"
        >
          <Icon name={visible ? "eye" : "eyeOff"} />
        </Pressable>
      }
      {...props}
    />
  );
}
