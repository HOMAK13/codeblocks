import {
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
    View,
    Text,
} from "react-native";
import CodeBlockPrint from "../components/CodeBlockPrrint";
import Droppable from "../shared/Interfaces/Droppable";
import Renderable from "../shared/Interfaces/Renderable";
import Returnable from "../shared/Interfaces/Returnable";
import CCodeBlock from "./Functional/CodeBlock";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Value from "./Functional/Value";
import TypeNumber from "./types/TypeNumber";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import { Dispatch, DispatchWithoutAction, Key, useReducer } from "react";
import { Position } from "../shared/types";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import TypeString from "./types/TypeString";
import TypeVoid from "./types/TypeVoid";
import { uuidv4 } from "../shared/functions";
import TypeBool from "./types/TypeBool";
import CodeBlockLogicNot from "../components/CodeBlockLogicNot";

class CCodeBlockLogicNot
    extends CCodeBlock
    implements Returnable, Renderable, Droppable
{
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    wrapper: CCodeBlockWrapper;
    onPickUp?: () => void;

    constructor(
        wrapper: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        onPickUp?: () => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(next, prev, parent);
        this.onDrop = onDrop;
        this.wrapper = wrapper;
        this.onPickUp = onPickUp;
    }
    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) {
        Animated.spring(new Animated.ValueXY(position), {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
        if (this.parent) {
            this.removeThisCodeBLock();
            this.onDrop(e, g, this);
        } else {
            let blockWrapper = new CCodeBlockWrapper(null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockLogicNot(blockWrapper, this.onDrop)
            );
        }
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавление в Print");
        if (this.checkDropIn(g)) {
            if (block.id === this.id) return true;
            if (this.wrapper.checkDropIn(g)) {
                return this.wrapper.insertCodeBlock(e, g, block);
            }
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) return this.next.insertCodeBlock(e, g, block);
        return false;
    }

    render(props: any): JSX.Element {
        return (
            <CodeBlockLogicNot
                key={uuidv4()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.setPositions.bind(this)}
                wrapper={this.wrapper}
                rerender={props.rerender}
                onPickUp={this.onPickUp}></CodeBlockLogicNot>
        );
    }
    execute(le: LexicalEnvironment): Value {
        let output = this.wrapper.execute(new LexicalEnvironment(le));
        if (output.type === TypeVoid) {
            throw new Error(
                "Ошибка логического блока. Значение не может иметь тип void."
            );
        }
        return new Value(
            TypeBool,
            !new TypeBool().convertFromOtherType(output.value)
        );
    }
}

export default CCodeBlockLogicNot;

