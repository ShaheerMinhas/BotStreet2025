import { Request , Response } from "express";
import pool from "../config/db";

export const getOrganizations = async (req: Request , res : Response) : Promise<any> => {
    try{
        const [rows] = await pool.query( 'SELECT * FROM organizations');
        res.status(200).json(rows);
    }
    catch(error){
        console.error("Error Fetching Organizations");
        res.status(500).json({message:"Failed To Fetch Organizations"})
    }
};