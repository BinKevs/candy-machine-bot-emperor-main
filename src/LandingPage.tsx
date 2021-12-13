import React from "react";
import pingles_banner from "./static/pickles_banner.png";
import pingles_middle from "./static/pickles_middle.png";
import pickles_logo from "./static/pickles_logo.png";
class LandingPage extends React.Component {
	render() {
		return (
			<>
				<div className="bg-white flex flex-col h-screen">
					<div className="">
						<img
							className="w-full md:w-4/12 mx-auto"
							src={pingles_banner}
							alt=""
						/>
					</div>

					<div className="w-full m-auto">
						<img
							className="md:w-2/12 w-4/12 mx-auto"
							src={pingles_middle}
							alt=""
						/>
						<div className="flex justify-center">
							<button className="p-2 text-xl font-bold md:w-2/12 w-1/2 bg-landing-button-color text-white">
								MINT
							</button>
						</div>
					</div>
					<div className="bg-white py-10">
						<div className="flex justify-center text-md md:text-xl font-bold text-gray-700">
							Copyright 2021 - Crazy
							Pickles
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default LandingPage;
