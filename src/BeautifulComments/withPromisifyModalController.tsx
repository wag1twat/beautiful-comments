import React, { useCallback, useEffect, useState } from "react";

export interface BasePromisifyModalProps<T> {
  createOpen: (onOpen: () => () => Promise<T>) => void;
}

export const withPromisifyModalController = <
  T extends BasePromisifyModalProps<any>
>(
  Component: React.ComponentType<
    {
      isOpen: boolean;
      onClose: <T>(reason: T) => void;
      onConfirm: <T>(value: T) => void;
    } & T
  >
) => {
  return (props: T) => {
    const { createOpen } = props;

    let resolve: undefined | ((value: any | PromiseLike<any>) => void) =
      undefined;
    let reject: undefined | ((reason?: any) => void);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onOpen = useCallback(() => {
      setIsOpen(true);

      const promise = new Promise<any>((_resolve, _reject) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resolve = _resolve;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        reject = _reject;
      });

      return promise;
    }, []);

    const onClose = useCallback(
      (reason: any) => {
        setIsOpen(false);
        if (reject) {
          reject(new Error(reason));
        }
      },
      [reject]
    );

    const onConfirm = useCallback(
      (value: any) => {
        setIsOpen(false);

        if (resolve) {
          resolve(value);
        }
      },
      [resolve]
    );

    useEffect(() => {
      createOpen(() => onOpen);
    }, [createOpen, onOpen]);
    if (isOpen) {
      return (
        <Component
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={onConfirm}
          {...props}
        />
      );
    }

    return null;
  };
};
