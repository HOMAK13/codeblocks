import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Draggable from "./Draggable";
import { Children, DispatchWithoutAction, Key, PropsWithChildren } from "react";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import Select from "./Select";
import { uuidv4 } from "../shared/functions";

interface Props {
    key: Key;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    wrapperLeft: CCodeBlockWrapper;
    wrapperRight: CCodeBlockWrapper;
    operator: string;
    setValue: (operator: string) => void;
    rerender: DispatchWithoutAction;
    onPickUp?: () => void;
}

const CodeBlockMath = (props: Props & PropsWithChildren) => {
    let element: View | null;
    return (
        <Draggable
            onDrop={props.onDrop}
            styles={styles.container}
            onPickUp={props.onPickUp}>
            <View
                ref={(view) => (element = view)}
                onLayout={(e) => {
                    element?.measure((x, y, w, h, px, py) => {
                        props.onLayout(px, py, w, h);
                    });
                }}>
                {props.wrapperLeft.render({
                    key: uuidv4(),
                    rerender: props.rerender,
                })}
                <Select
                    options={["+", "-", "/", "*", "pow", "mod"]}
                    onSelect={(e) => {
                        props.setValue(e);
                        props.rerender();
                    }}
                    selectedOption={props.operator || "Мат. оператор"}></Select>
                {props.wrapperRight.render({
                    key: uuidv4(),
                    rerender: props.rerender,
                })}
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        minHeight: 100,
        backgroundColor: "yellow",
        color: "white",
    },
    textColor: {
        color: "white",
    },
});

export default CodeBlockMath;

