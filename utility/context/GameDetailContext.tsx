import { IBank, IErrorAPI, IGameDetailItem } from "@utility/types";
import { getDetailVouherService } from "@services/player.service";
import { UNKNOWM_ERROR } from "@utility/constant.utils";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";

type GameDetailContextType = {
  voucher: IGameDetailItem | null;
  error: IErrorAPI | null;
  banks: Partial<IBank[]>;
  loading: boolean;
  onFetchDataHandler: (ID: any) => void;
};

const gameDetailContextDefaultValues: GameDetailContextType = {
  loading: true,
  voucher: null,
  banks: [],
  error: null,
  onFetchDataHandler: () => {},
};

export const GameDetailContext = createContext<GameDetailContextType>(
  gameDetailContextDefaultValues
);

export function useGameDetailContext() {
  return useContext(GameDetailContext);
}

type Props = {
  children: ReactNode;
};

export function GameDetailProvider({ children }: Props) {
  const [error, setError] = useState<IErrorAPI | null>(null);
  const [banks, setBanks] = useState<Partial<IBank[]>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [voucher, setVoucher] = useState<IGameDetailItem | null>(null);

  const onFetchDetailData = useCallback(async (id: any) => {
    try {
      const getVoucher = (await getDetailVouherService(id)) as any;
      setVoucher(getVoucher.voucher);
      setBanks(getVoucher.banks);
    } catch (error: any) {
      if (error.name !== UNKNOWM_ERROR) {
        setError(error);
      }
    }

    setLoading(false);
  }, []);

  const value: GameDetailContextType = {
    error,
    banks,
    voucher,
    loading,
    onFetchDataHandler: onFetchDetailData,
  };

  return (
    <>
      <GameDetailContext.Provider value={value}>
        {children}
      </GameDetailContext.Provider>
    </>
  );
}
