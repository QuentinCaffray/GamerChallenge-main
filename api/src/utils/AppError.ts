// Classe d'erreur custom pour gérer les erreurs HTTP avec statusCode et distinguer les erreurs prévues (isOperational) des bugs serveur

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
