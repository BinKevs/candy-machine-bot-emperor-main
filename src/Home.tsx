import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
	CandyMachine,
	awaitTransactionSignatureConfirmation,
	getCandyMachineState,
	mintOneToken,
	shortenAddress,
} from "./candy-machine";

import banner from "./static/emperors_banner-copy.png";
import preview from "./static/crop.png";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
	candyMachineId: anchor.web3.PublicKey;
	config: anchor.web3.PublicKey;
	connection: anchor.web3.Connection;
	startDate: number;
	treasury: anchor.web3.PublicKey;
	txTimeout: number;
}

const Home = (props: HomeProps) => {
	const [balance, setBalance] = useState<number>();
	const [isActive, setIsActive] = useState(false); // true when countdown completes
	const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
	const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

	const [itemsAvailable, setItemsAvailable] = useState(0);
	const [itemsRedeemed, setItemsRedeemed] = useState(0);
	const [itemsRemaining, setItemsRemaining] = useState(0);

	const [alertState, setAlertState] = useState<AlertState>({
		open: false,
		message: "",
		severity: undefined,
	});

	const [startDate, setStartDate] = useState(new Date(props.startDate));

	const wallet = useAnchorWallet();
	const [candyMachine, setCandyMachine] = useState<CandyMachine>();

	const refreshCandyMachineState = () => {
		(async () => {
			if (!wallet) return;

			const {
				candyMachine,
				goLiveDate,
				itemsAvailable,
				itemsRemaining,
				itemsRedeemed,
			} = await getCandyMachineState(
				wallet as anchor.Wallet,
				props.candyMachineId,
				props.connection
			);

			setItemsAvailable(itemsAvailable);
			setItemsRemaining(itemsRemaining);
			setItemsRedeemed(itemsRedeemed);

			setIsSoldOut(itemsRemaining === 0);
			setStartDate(goLiveDate);
			setCandyMachine(candyMachine);
		})();
	};

	const onMint = async () => {
		try {
			setIsMinting(true);
			if (wallet && candyMachine?.program) {
				const mintTxId = await mintOneToken(
					candyMachine,
					props.config,
					wallet.publicKey,
					props.treasury
				);

				const status =
					await awaitTransactionSignatureConfirmation(
						mintTxId,
						props.txTimeout,
						props.connection,
						"singleGossip",
						false
					);

				if (!status?.err) {
					setAlertState({
						open: true,
						message: "Congratulations! Mint succeeded!",
						severity: "success",
					});
				} else {
					setAlertState({
						open: true,
						message: "Mint failed! Please try again!",
						severity: "error",
					});
				}
			}
		} catch (error: any) {
			// TODO: blech:
			let message =
				error.msg ||
				"Minting failed! Please try again!";
			if (!error.msg) {
				if (error.message.indexOf("0x138")) {
				} else if (error.message.indexOf("0x137")) {
					message = `SOLD OUT!`;
				} else if (error.message.indexOf("0x135")) {
					message = `Insufficient funds to mint. Please fund your wallet.`;
				}
			} else {
				if (error.code === 311) {
					message = `SOLD OUT!`;
					setIsSoldOut(true);
				} else if (error.code === 312) {
					message = `Minting period hasn't started yet.`;
				}
			}

			setAlertState({
				open: true,
				message,
				severity: "error",
			});
		} finally {
			if (wallet) {
				const balance =
					await props.connection.getBalance(
						wallet.publicKey
					);
				setBalance(balance / LAMPORTS_PER_SOL);
			}
			setIsMinting(false);
			refreshCandyMachineState();
		}
	};

	useEffect(() => {
		(async () => {
			if (wallet) {
				const balance =
					await props.connection.getBalance(
						wallet.publicKey
					);
				setBalance(balance / LAMPORTS_PER_SOL);
			}
		})();
	}, [wallet, props.connection]);

	useEffect(refreshCandyMachineState, [
		wallet,
		props.candyMachineId,
		props.connection,
	]);

	return (
		<main>
			{/* {wallet && (
        <p>Wallet {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
      )}

      {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>}

      {wallet && <p>Total Available: {itemsAvailable}</p>}

      {wallet && <p>Redeemed: {itemsRedeemed}</p>}

      {wallet && <p>Remaining: {itemsRemaining}</p>} */}

			<div className="bg-landing-bg-image bg-cover bg-center bg-no-repeat flex flex-col h-screen relative">
				<div className="my-10">
					<img
						className="mx-auto md:w-1/2 w-full"
						src={banner}
						alt=""
					/>
				</div>

				<div className="w-full mx-auto space-y-2">
					<img
						className="md:w-3/12 w-9/12  mx-auto rounded-md "
						src={preview}
						alt=""
					/>
					<div className="flex justify-center">
						{/* <button className="p-2 text-xl font-bold md:w-2/12 w-1/2 bg-landing-button-color text-white">
							MINT
						</button> */}

						{/* <MintContainer> */}
						{!wallet ? (
							<ConnectButton
								style={{
									paddingLeft:
										"0.75rem",
									paddingRight:
										"0.75rem",
									paddingTop: "0.75rem",
									paddingBottom:
										"0.75rem",
									fontSize: "1rem",
									fontWeight: "bold",
									lineHeight: "1.75rem",
									marginBottom:
										"2.5rem",
									backgroundColor:
										"rgba(219, 83, 66)",
									color: "rgba(255, 255, 255,1",
								}}
							>
								Connect Wallet
							</ConnectButton>
						) : (
							<button
								className="p-2 text-xl font-bold md:w-2/12 w-1/2 bg-landing-button-color text-white rounded-md"
								disabled={
									isSoldOut ||
									isMinting ||
									!isActive
								}
								onClick={onMint}
								// variant="contained"
							>
								{isSoldOut ? (
									"SOLD OUT"
								) : isActive ? (
									isMinting ? (
										<CircularProgress />
									) : (
										"MINT"
									)
								) : (
									<Countdown
										date={
											startDate
										}
										onMount={({
											completed,
										}) =>
											completed &&
											setIsActive(
												true
											)
										}
										onComplete={() =>
											setIsActive(
												true
											)
										}
										renderer={
											renderCounter
										}
									/>
								)}
							</button>
						)}
						{/* </MintContainer> */}
					</div>
				</div>
				<div className="bg-black absolute bottom-0 w-full">
					<div className="my-5 md:my-3">
						<div className="flex justify-center text-sm md:text-md font-normal text-gray-200">
							Copyright 2021 - Robot
							Emperors
						</div>
					</div>
				</div>
			</div>

			<Snackbar
				open={alertState.open}
				autoHideDuration={6000}
				onClose={() =>
					setAlertState({
						...alertState,
						open: false,
					})
				}
			>
				<Alert
					onClose={() =>
						setAlertState({
							...alertState,
							open: false,
						})
					}
					severity={alertState.severity}
				>
					{alertState.message}
				</Alert>
			</Snackbar>
		</main>
	);
};

interface AlertState {
	open: boolean;
	message: string;
	severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
	return (
		<CounterText>
			{hours + (days || 0) * 24} hours, {minutes} minutes,{" "}
			{seconds} seconds
		</CounterText>
	);
};

export default Home;
