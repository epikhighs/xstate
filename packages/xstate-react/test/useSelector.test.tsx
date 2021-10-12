import * as React from 'react';
import {ActorRefFrom, assign, createMachine, spawn} from 'xstate';
import {render, cleanup, fireEvent} from '@testing-library/react';
import {useInterpret, useSelector, useActor, useMachine} from '../src';

afterEach(cleanup);

describe('useSelector', () => {
  it('should update context when used with a spawned machine', () => {
    const spawnedMachine = createMachine<{ count: number }>({
      id: "spawned",
      initial: "inactive",
      context: {
        count: 0
      },
      states: {
        inactive: {
          on: {
            TOGGLE: "active"
          }
        },
        active: {
          on: {
            TOGGLE: "inactive"
          }
        }
      },
      on: {
        UPDATE_COUNT: {
          actions: assign({
            count: (ctx) => ctx.count + 1
          })
        }
      }
    });
    const parentMachine = createMachine<{ childActor: Object }>({
      initial: 'idle',
      context: {
        childActor: {},
      },
      states: {
        idle: {
          entry: ['spawnMachine']
        }
      },
    }, {
      actions: {
        spawnMachine: assign({
          childActor: () => {
            return spawn(spawnedMachine, 'spawnedMachine');
          }
        })
      },
    });

    const App = () => {
      const [state] = useMachine(parentMachine);
      return (
        <div className="App">
          <ChildComponent actor={state.context.childActor as ActorRefFrom<typeof spawnedMachine>}/>
        </div>
      );
    };

    const selector = (state) => state.context.count;

    const ChildComponent: React.FC<{ actor: ActorRefFrom<typeof spawnedMachine> }> = ({actor}) => {
      const count = useSelector(actor, selector);
      const [state] = useActor(actor);

      return (
        <>
          <div>
            (useSelector - does not update) Child Actor's state.context.count:
            <span data-testid="useSelectorCount">{count}</span>
          </div>

          <div>
            (useActor) Child Actor's state.context.count:
            <span data-testid="useActorCount">{state.context.count}</span>
          </div>

          <button data-testid="incrementButton" onClick={() => actor.send("UPDATE_COUNT")}>
            Update Spawned Machine
          </button>
        </>
      );
    };

    const {getByTestId} = render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>
    );
    const $useSelectorCount = getByTestId('useSelectorCount');
    const $useActorCount = getByTestId('useActorCount');
    const $incrementButton = getByTestId('incrementButton');

    expect($useActorCount.textContent).toBe('0');
    expect($useSelectorCount.textContent).toBe('0');

    // does not invoke the subscrition callback in useSelector.ts:42
    fireEvent.click($incrementButton);

    expect($useActorCount.textContent).toBe('1');
    expect($useSelectorCount.textContent).toBe('1');

    fireEvent.click($incrementButton);

    expect($useActorCount.textContent).toBe('2');
    expect($useSelectorCount.textContent).toBe('2');
  });

  it('only rerenders for selected values', () => {
    const machine = createMachine<{ count: number; other: number }>({
      initial: 'active',
      context: {
        other: 0,
        count: 0
      },
      states: {
        active: {}
      },
      on: {
        OTHER: {
          actions: assign({ other: (ctx) => ctx.other + 1 })
        },
        INCREMENT: {
          actions: assign({ count: (ctx) => ctx.count + 1 })
        }
      }
    });

    let rerenders = 0;

    const App = () => {
      const service = useInterpret(machine);
      const count = useSelector(service, (state) => state.context.count);

      rerenders++;

      return (
        <>
          <div data-testid="count">{count}</div>
          <button
            data-testid="other"
            onClick={() => service.send('OTHER')}
          ></button>
          <button
            data-testid="increment"
            onClick={() => service.send('INCREMENT')}
          ></button>
        </>
      );
    };

    const { getByTestId } = render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    const countButton = getByTestId('count');
    const otherButton = getByTestId('other');
    const incrementEl = getByTestId('increment');

    fireEvent.click(incrementEl);

    rerenders = 0;

    fireEvent.click(otherButton);
    fireEvent.click(otherButton);
    fireEvent.click(otherButton);
    fireEvent.click(otherButton);

    expect(rerenders).toEqual(0);

    fireEvent.click(incrementEl);

    expect(countButton.textContent).toBe('2');
  });

  it('should work with a custom comparison function', () => {
    const machine = createMachine<{ name: string }>({
      initial: 'active',
      context: {
        name: 'david'
      },
      states: {
        active: {}
      },
      on: {
        CHANGE: {
          actions: assign({ name: (_, e) => e.value })
        }
      }
    });

    const App = () => {
      const service = useInterpret(machine);
      const name = useSelector(
        service,
        (state) => state.context.name,
        (a, b) => a.toUpperCase() === b.toUpperCase()
      );

      return (
        <>
          <div data-testid="name">{name}</div>
          <button
            data-testid="sendUpper"
            onClick={() => service.send({ type: 'CHANGE', value: 'DAVID' })}
          ></button>
          <button
            data-testid="sendOther"
            onClick={() => service.send({ type: 'CHANGE', value: 'other' })}
          ></button>
        </>
      );
    };

    const { getByTestId } = render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    const nameEl = getByTestId('name');
    const sendUpperButton = getByTestId('sendUpper');
    const sendOtherButton = getByTestId('sendOther');

    expect(nameEl.textContent).toEqual('david');

    fireEvent.click(sendUpperButton);

    // unchanged due to comparison function
    expect(nameEl.textContent).toEqual('david');

    fireEvent.click(sendOtherButton);

    expect(nameEl.textContent).toEqual('other');

    fireEvent.click(sendUpperButton);

    expect(nameEl.textContent).toEqual('DAVID');
  });
});
