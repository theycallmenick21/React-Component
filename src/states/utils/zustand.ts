// default export from zustand is allowed here because this file is only used to create the custom create function
// eslint-disable-next-line no-restricted-imports
import _create, { StateCreator } from 'zustand'

const resetStoreFunctions = new Set<() => void>()

/**
 * Creates a store with the given state creator. If no state creator is given, a default state creator is used.
 * This function should be used instead of zustand's createStore function so that the store can be reset.
 *
 * @param createState - The createState object to be used in creating the state.
 * @returns The store.
 */
const create = (<T extends object>(createState?: StateCreator<T>) => {
    if (createState === undefined) return _create

    // create a reset function for the store so that it can be reset later
    const store = _create(createState)
    const initialState = store.getState()
    resetStoreFunctions.add(() => {
        store.setState(initialState, true)
    })

    return store
}) as typeof _create

/**
 * Resets all stores that were created using the create function.
 */
const resetAllStores = () => {
    resetStoreFunctions.forEach((resetFunction) => {
        resetFunction()
    })
}

export { create, resetAllStores }
