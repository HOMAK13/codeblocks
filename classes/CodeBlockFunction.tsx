import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import CCodeBlock from "./CodeBlock";
import { TYPES } from "../shared/types";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";

interface ICodeBlockFunction {
    codeBlocksWrapper_: CCodeBlockWrapper;
    cfl: (fn: CodeBlockFunction) => void;
    returnType: TYPES;
    le: LexicalEnvironment;
}

class CodeBlockFunction implements ICodeBlockFunction, Returnable {
    codeBlocksWrapper_: CCodeBlockWrapper;
    cfl: (fn: CodeBlockFunction) => void;
    returnType: TYPES;
    le: LexicalEnvironment;

    constructor(
        codeBlocksTree: CCodeBlockWrapper,
        changeFunctionList: (fn: CodeBlockFunction) => void,
        returnType: TYPES,
        le: LexicalEnvironment
    ) {
        this.codeBlocksWrapper_ = codeBlocksTree;
        this.cfl = changeFunctionList;
        this.returnType = returnType;
        this.le = le;
    }

    set codeBlocks(newCodeBlocks: CCodeBlockWrapper) {
        this.codeBlocksWrapper_ = newCodeBlocks;
    }
    get codeBlocks() {
        return this.codeBlocksWrapper_;
    }

    insertNewCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) {
        this.codeBlocks.insertCodeBlock(e, g, block);
        this.cfl(this);
    }

    execute(): Value {
        this.le = new LexicalEnvironment(this.le.prev);
        return this.codeBlocks.execute();
    }
}

export default CodeBlockFunction;

