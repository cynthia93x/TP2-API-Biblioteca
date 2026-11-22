import { RequestHandler } from 'express';
import { libroService } from './libro.service';

export const getAll: RequestHandler = async (_req, res, next) => {
  try {
    res.status(200).json(await libroService.getAll());
  } catch (error) {
    next(error);
  }
};

export const getById: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json(await libroService.getById(req.params.id));
  } catch (error) {
    next(error);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    res.status(201).json(await libroService.create(req.body));
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json(await libroService.update(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json(await libroService.delete(req.params.id));
  } catch (error) {
    next(error);
  }
};
