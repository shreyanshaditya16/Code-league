import { VisualizerStep } from '../types/dsa';

export interface ListNode {
  id: string;
  value: number;
}

export function generateStackPushSteps(currentStack: (string | number)[], val: string | number, maxCap = 6): { newStack: (string | number)[]; steps: VisualizerStep[] } {
  const steps: VisualizerStep[] = [];
  const stack = [...currentStack];

  steps.push({
    stepIndex: 0,
    description: `Attempting Stack push(${val}). First checking if stack is full (current size = ${stack.length}, max = ${maxCap}).`,
    codeLine: 1,
    stackState: [...stack],
    actionType: 'push',
  });

  if (stack.length >= maxCap) {
    steps.push({
      stepIndex: 1,
      description: `Stack Overflow Error! Maximum capacity (${maxCap}) reached. Cannot push ${val}.`,
      codeLine: 2,
      stackState: [...stack],
      actionType: 'done',
    });
    return { newStack: stack, steps };
  }

  stack.push(val);

  steps.push({
    stepIndex: steps.length,
    description: `Pushed ${val} onto top of stack (Index ${stack.length - 1}). Top pointer incremented.`,
    codeLine: 3,
    stackState: [...stack],
    actionType: 'push',
  });

  return { newStack: stack, steps };
}

export function generateStackPopSteps(currentStack: (string | number)[]): { newStack: (string | number)[]; steps: VisualizerStep[] } {
  const steps: VisualizerStep[] = [];
  const stack = [...currentStack];

  steps.push({
    stepIndex: 0,
    description: `Attempting Stack pop(). Checking if stack is empty.`,
    codeLine: 1,
    stackState: [...stack],
    actionType: 'pop',
  });

  if (stack.length === 0) {
    steps.push({
      stepIndex: 1,
      description: `Stack Underflow Error! Cannot pop from an empty stack.`,
      codeLine: 2,
      stackState: [],
      actionType: 'done',
    });
    return { newStack: [], steps };
  }

  const popped = stack.pop();

  steps.push({
    stepIndex: steps.length,
    description: `Popped ${popped} from the top of the stack. LIFO order maintained. Top pointer decremented.`,
    codeLine: 3,
    stackState: [...stack],
    actionType: 'pop',
  });

  return { newStack: stack, steps };
}

export function generateQueueEnqueueSteps(currentQueue: (string | number)[], val: string | number, maxCap = 6): { newQueue: (string | number)[]; steps: VisualizerStep[] } {
  const steps: VisualizerStep[] = [];
  const queue = [...currentQueue];

  steps.push({
    stepIndex: 0,
    description: `Attempting Queue enqueue(${val}). Checking if queue is full (size = ${queue.length}, max = ${maxCap}).`,
    codeLine: 1,
    queueState: [...queue],
    actionType: 'enqueue',
  });

  if (queue.length >= maxCap) {
    steps.push({
      stepIndex: 1,
      description: `Queue Overflow! Capacity limit reached. Cannot enqueue ${val}.`,
      codeLine: 2,
      queueState: [...queue],
      actionType: 'done',
    });
    return { newQueue: queue, steps };
  }

  queue.push(val);

  steps.push({
    stepIndex: steps.length,
    description: `Enqueued ${val} at the REAR of the queue. Rear pointer advanced to index ${queue.length - 1}.`,
    codeLine: 3,
    queueState: [...queue],
    actionType: 'enqueue',
  });

  return { newQueue: queue, steps };
}

export function generateQueueDequeueSteps(currentQueue: (string | number)[]): { newQueue: (string | number)[]; steps: VisualizerStep[] } {
  const steps: VisualizerStep[] = [];
  const queue = [...currentQueue];

  steps.push({
    stepIndex: 0,
    description: `Attempting Queue dequeue(). Checking if queue is empty.`,
    codeLine: 1,
    queueState: [...queue],
    actionType: 'dequeue',
  });

  if (queue.length === 0) {
    steps.push({
      stepIndex: 1,
      description: `Queue Underflow! Cannot dequeue from an empty queue.`,
      codeLine: 2,
      queueState: [],
      actionType: 'done',
    });
    return { newQueue: [], steps };
  }

  const dequeued = queue.shift();

  steps.push({
    stepIndex: steps.length,
    description: `Dequeued ${dequeued} from the FRONT of the queue. FIFO order preserved.`,
    codeLine: 3,
    queueState: [...queue],
    actionType: 'dequeue',
  });

  return { newQueue: queue, steps };
}

export function generateLinkedListInsertSteps(
  currentList: ListNode[],
  val: number,
  position: 'head' | 'tail'
): { newList: ListNode[]; steps: VisualizerStep[] } {
  const steps: VisualizerStep[] = [];
  const list = [...currentList];
  const newNode: ListNode = { id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, value: val };

  steps.push({
    stepIndex: 0,
    description: `Allocating new node with value ${val} in heap memory (newNode.val = ${val}, newNode.next = NULL).`,
    codeLine: 1,
    listState: [...list],
    actionType: 'insert',
  });

  if (position === 'head') {
    steps.push({
      stepIndex: 1,
      description: `Point newNode.next to current head (${list.length > 0 ? list[0].value : 'NULL'}).`,
      codeLine: 2,
      listState: [...list],
      activeNodeId: newNode.id,
      actionType: 'insert',
    });

    const updatedList = [newNode, ...list];
    steps.push({
      stepIndex: 2,
      description: `Update head pointer to newNode (${val}). New head insertion complete in O(1) time.`,
      codeLine: 3,
      listState: updatedList,
      activeNodeId: newNode.id,
      actionType: 'done',
    });

    return { newList: updatedList, steps };
  } else {
    if (list.length === 0) {
      const updatedList = [newNode];
      steps.push({
        stepIndex: 1,
        description: `List was empty. Head now points directly to newNode (${val}).`,
        codeLine: 3,
        listState: updatedList,
        activeNodeId: newNode.id,
        actionType: 'done',
      });
      return { newList: updatedList, steps };
    }

    // Traverse to tail
    for (let i = 0; i < list.length; i++) {
      steps.push({
        stepIndex: steps.length,
        description: `Traversing list: current pointer at node [${list[i].value}], index ${i}.`,
        codeLine: 4,
        listState: [...list],
        activeNodeId: list[i].id,
        actionType: 'search',
      });
    }

    const updatedList = [...list, newNode];
    steps.push({
      stepIndex: steps.length,
      description: `Reached tail node (${list[list.length - 1].value}). Updating tail.next = newNode (${val}). Insertion complete.`,
      codeLine: 5,
      listState: updatedList,
      activeNodeId: newNode.id,
      actionType: 'done',
    });

    return { newList: updatedList, steps };
  }
}

export function generateLinkedListDeleteSteps(
  currentList: ListNode[],
  val: number
): { newList: ListNode[]; steps: VisualizerStep[] } {
  const steps: VisualizerStep[] = [];
  const list = [...currentList];

  steps.push({
    stepIndex: 0,
    description: `Initiating deletion of node with value ${val}. Searching from head node.`,
    codeLine: 1,
    listState: [...list],
    actionType: 'delete',
  });

  if (list.length === 0) {
    steps.push({
      stepIndex: 1,
      description: `Linked list is empty. Nothing to delete.`,
      codeLine: 2,
      listState: [],
      actionType: 'done',
    });
    return { newList: [], steps };
  }

  // Deleting head
  if (list[0].value === val) {
    steps.push({
      stepIndex: 1,
      description: `Head node contains target value ${val}. Update head = head.next and free old head node.`,
      codeLine: 3,
      listState: [...list],
      activeNodeId: list[0].id,
      actionType: 'delete',
    });

    const updatedList = list.slice(1);
    steps.push({
      stepIndex: 2,
      description: `Node with value ${val} deleted. Deleting head takes O(1) time.`,
      codeLine: 4,
      listState: updatedList,
      actionType: 'done',
    });

    return { newList: updatedList, steps };
  }

  // Traversing to find target
  let found = false;
  let targetIndex = -1;

  for (let i = 1; i < list.length; i++) {
    steps.push({
      stepIndex: steps.length,
      description: `Traversing: comparing current node [${list[i].value}] with target ${val}. prev is [${list[i - 1].value}].`,
      codeLine: 5,
      listState: [...list],
      activeNodeId: list[i].id,
      actionType: 'search',
    });

    if (list[i].value === val) {
      found = true;
      targetIndex = i;
      break;
    }
  }

  if (!found) {
    steps.push({
      stepIndex: steps.length,
      description: `Node with value ${val} was not found in the linked list. No nodes deleted.`,
      codeLine: 6,
      listState: [...list],
      actionType: 'done',
    });
    return { newList: list, steps };
  }

  steps.push({
    stepIndex: steps.length,
    description: `Target node [${val}] located at index ${targetIndex}. Unlinking: prev.next = current.next.`,
    codeLine: 7,
    listState: [...list],
    activeNodeId: list[targetIndex].id,
    actionType: 'delete',
  });

  const updatedList = list.filter((_, idx) => idx !== targetIndex);
  steps.push({
    stepIndex: steps.length,
    description: `Target node removed and memory released. List updated.`,
    codeLine: 8,
    listState: updatedList,
    actionType: 'done',
  });

  return { newList: updatedList, steps };
}
