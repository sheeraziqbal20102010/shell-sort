import { BarState, SortStep } from '../types';

export function getGapSequence(n: number): number[] {
  const gaps: number[] = [];
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    gaps.push(gap);
  }
  return gaps;
}

export function generateShellSortSteps(inputArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;
  let comparisonsCount = 0;
  let shiftsCount = 0;

  function getThreadIndices(currentIndex: number, currentGap: number): number[] {
    if (currentGap <= 0) return [];
    const base = currentIndex % currentGap;
    const indices: number[] = [];
    for (let idx = base; idx < n; idx += currentGap) {
      indices.push(idx);
    }
    return indices;
  }

  function createBarStates(
    currentGap: number,
    currentThread: number[],
    comparing: [number, number] | null,
    tempIndex: number | null,
    shiftedIndex: number | null,
    insertedIndex: number | null,
    allSorted = false
  ): BarState[] {
    if (allSorted) {
      return Array(n).fill('sorted');
    }
    const states: BarState[] = Array(n).fill('default');

    // First mark thread items
    if (currentGap > 0) {
      for (const idx of currentThread) {
        if (idx < n) {
          states[idx] = 'thread';
        }
      }
    }

    // Mark temp / shifting element
    if (tempIndex !== null && tempIndex >= 0 && tempIndex < n) {
      states[tempIndex] = 'shifting';
    }

    // Mark shifted element
    if (shiftedIndex !== null && shiftedIndex >= 0 && shiftedIndex < n) {
      states[shiftedIndex] = 'shifting';
    }

    // Mark actively compared elements
    if (comparing) {
      const [left, right] = comparing;
      if (left >= 0 && left < n) states[left] = 'comparing';
      if (right >= 0 && right < n) states[right] = 'comparing';
    }

    // Mark element that was just placed
    if (insertedIndex !== null && insertedIndex >= 0 && insertedIndex < n) {
      states[insertedIndex] = 'inserted';
    }

    return states;
  }

  // Step 0: Initial State
  steps.push({
    stepIndex: 0,
    type: 'init',
    array: [...arr],
    cppLine: 1,
    gap: Math.floor(n / 2),
    i: null,
    j: null,
    temp: null,
    comparedIndices: null,
    shiftedIndex: null,
    insertedIndex: null,
    barStates: Array(n).fill('default'),
    threadIndices: [],
    explanation: `Array loaded with ${n} elements. Shell Sort begins by choosing an initial gap of n/2 = ${Math.floor(n / 2)}.`,
    subExplanation: `Shell Sort sorts elements that are far apart first, then gradually shrinks the distance to 1 for final fast insertion.`,
    stats: {
      comparisons: 0,
      shifts: 0,
      currentGap: Math.floor(n / 2),
    },
  });

  // Algorithm simulation
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Gap change step
    steps.push({
      stepIndex: steps.length,
      type: 'gap_change',
      array: [...arr],
      cppLine: 2,
      gap: gap,
      i: null,
      j: null,
      temp: null,
      comparedIndices: null,
      shiftedIndex: null,
      insertedIndex: null,
      barStates: Array(n).fill('default'),
      threadIndices: [],
      explanation: `Shrink gap: Set gap = ${gap}. Array will now be partitioned into ${gap} interleaved sub-arrays, each spaced ${gap} indices apart.`,
      subExplanation: `We will run gapped insertion sort on elements at intervals of ${gap}.`,
      stats: {
        comparisons: comparisonsCount,
        shifts: shiftsCount,
        currentGap: gap,
      },
    });

    for (let i = gap; i < n; i++) {
      const thread = getThreadIndices(i, gap);

      // Start outer loop for index i
      steps.push({
        stepIndex: steps.length,
        type: 'outer_loop',
        array: [...arr],
        cppLine: 3,
        gap: gap,
        i: i,
        j: null,
        temp: null,
        comparedIndices: null,
        shiftedIndex: null,
        insertedIndex: null,
        barStates: createBarStates(gap, thread, null, null, null, null),
        threadIndices: thread,
        explanation: `Starting gapped pass for index i = ${i} (value ${arr[i]}). Highlighted purple bars belong to the same gap-${gap} thread.`,
        subExplanation: `We will compare arr[${i}] against earlier elements in its gap thread (${thread.filter(idx => idx <= i).join(', ')}).`,
        stats: {
          comparisons: comparisonsCount,
          shifts: shiftsCount,
          currentGap: gap,
        },
      });

      const temp = arr[i];
      let j = i;

      // Pick temp
      steps.push({
        stepIndex: steps.length,
        type: 'pick_temp',
        array: [...arr],
        cppLine: 4,
        gap: gap,
        i: i,
        j: j,
        temp: temp,
        comparedIndices: null,
        shiftedIndex: null,
        insertedIndex: null,
        barStates: createBarStates(gap, thread, null, i, null, null),
        threadIndices: thread,
        explanation: `Holding temp = arr[${i}] = ${temp} in memory. Setting pointer j = ${i}.`,
        subExplanation: `Now looking back at intervals of ${gap} to find where ${temp} belongs in this gap thread.`,
        stats: {
          comparisons: comparisonsCount,
          shifts: shiftsCount,
          currentGap: gap,
        },
      });

      // While loop gapped comparisons
      while (j >= gap) {
        comparisonsCount++;
        const leftIdx = j - gap;
        const leftVal = arr[leftIdx];
        const conditionMet = leftVal > temp;

        // Step: Comparison
        steps.push({
          stepIndex: steps.length,
          type: 'compare',
          array: [...arr],
          cppLine: 6,
          gap: gap,
          i: i,
          j: j,
          temp: temp,
          comparedIndices: [leftIdx, j],
          shiftedIndex: null,
          insertedIndex: null,
          barStates: createBarStates(gap, thread, [leftIdx, j], null, null, null),
          threadIndices: thread,
          explanation: `Gap = ${gap}: Comparing arr[${leftIdx}] (value ${leftVal}) with temp (${temp}).`,
          subExplanation: conditionMet
            ? `Since ${leftVal} > ${temp} (TRUE), the larger element ${leftVal} must shift right by ${gap} to index ${j}.`
            : `Since ${leftVal} <= ${temp} (FALSE), element ${leftVal} is already in order relative to temp. Stop shifting.`,
          comparisonResult: {
            leftVal,
            leftIdx,
            tempVal: temp,
            conditionMet,
          },
          stats: {
            comparisons: comparisonsCount,
            shifts: shiftsCount,
            currentGap: gap,
          },
        });

        if (conditionMet) {
          // Perform shift
          shiftsCount++;
          arr[j] = arr[leftIdx];

          steps.push({
            stepIndex: steps.length,
            type: 'shift',
            array: [...arr],
            cppLine: 7,
            gap: gap,
            i: i,
            j: j,
            temp: temp,
            comparedIndices: null,
            shiftedIndex: j,
            insertedIndex: null,
            barStates: createBarStates(gap, thread, null, null, j, null),
            threadIndices: thread,
            explanation: `Shifted: Moved value ${arr[leftIdx]} from index ${leftIdx} rightward into index ${j} (arr[${j}] = arr[${leftIdx}]).`,
            subExplanation: `Pointer j decrements by gap (${j} - ${gap} = ${j - gap}) to check further left.`,
            stats: {
              comparisons: comparisonsCount,
              shifts: shiftsCount,
              currentGap: gap,
            },
          });

          j -= gap;
        } else {
          break;
        }
      }

      // Insert temp into arr[j]
      arr[j] = temp;

      steps.push({
        stepIndex: steps.length,
        type: 'insert',
        array: [...arr],
        cppLine: 10,
        gap: gap,
        i: i,
        j: j,
        temp: temp,
        comparedIndices: null,
        shiftedIndex: null,
        insertedIndex: j,
        barStates: createBarStates(gap, thread, null, null, null, j),
        threadIndices: thread,
        explanation: `Inserted temp = ${temp} into gapped slot arr[${j}].`,
        subExplanation: `The gap-${gap} sub-array ending at index ${i} is now sorted!`,
        stats: {
          comparisons: comparisonsCount,
          shifts: shiftsCount,
          currentGap: gap,
        },
      });
    }
  }

  // Final Sorted Step
  steps.push({
    stepIndex: steps.length,
    type: 'completed',
    array: [...arr],
    cppLine: 13,
    gap: 0,
    i: null,
    j: null,
    temp: null,
    comparedIndices: null,
    shiftedIndex: null,
    insertedIndex: null,
    barStates: Array(n).fill('sorted'),
    threadIndices: [],
    explanation: `🎉 Shell Sort is complete! The array is fully sorted in ascending order.`,
    subExplanation: `Total comparisons: ${comparisonsCount} | Total shifts: ${shiftsCount}. Notice how large distances sorted early made the final gap=1 pass ultra-fast!`,
    stats: {
      comparisons: comparisonsCount,
      shifts: shiftsCount,
      currentGap: 0,
    },
  });

  return steps;
}
