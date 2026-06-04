interface OptimisticUpdateProps {
    apiCallFn: () => Promise<unknown>;
    onSuccess: () => void;
    onError: () => void;
}

export const optimisticUpdate = async ({ apiCallFn, onSuccess, onError }: OptimisticUpdateProps) => {
    onSuccess();
    try {
        await apiCallFn();
    } catch {
        onError();
    }
};
