export type BarState = 
  | 'default'      // Slate Blue #4A90D9 or #6C7A89
  | 'thread'       // Light Purple #B39DDB (same gap-sequence thread)
  | 'comparing'    // Orange #FF7F50 (two elements actively being compared)
  | 'shifting'     // Amber/Gold #F5A623 (value temporarily held / shifting)
  | 'inserted'     // Red #E74C3C (flash/pulse inserted into position)
  | 'sorted';      // Green #2ECC71 (fully sorted array at end)

export type StepType = 
  | 'init'
  | 'gap_change'
  | 'outer_loop'
  | 'pick_temp'
  | 'compare'
  | 'shift'
  | 'insert'
  | 'completed';

export interface SortStep {
  stepIndex: number;
  type: StepType;
  array: number[];
  cppLine: number; // 1-indexed line number in C++ code
  gap: number;
  i: number | null;
  j: number | null;
  temp: number | null;
  comparedIndices: [number, number] | null; // [j - gap, j]
  shiftedIndex: number | null;
  insertedIndex: number | null;
  barStates: BarState[];
  threadIndices: number[]; // All indices in the current gap thread (e.g. i % gap, i % gap + gap, ...)
  explanation: string;
  subExplanation?: string;
  comparisonResult?: {
    leftVal: number;
    leftIdx: number;
    tempVal: number;
    conditionMet: boolean; // arr[j-gap] > temp
  };
  stats: {
    comparisons: number;
    shifts: number;
    currentGap: number;
  };
}

export interface GapInfo {
  gap: number;
  status: 'completed' | 'active' | 'upcoming';
}
