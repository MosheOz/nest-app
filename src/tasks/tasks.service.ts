import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks.slice();
    }

    getTasksByFilter(getTaskFilterDto: GetTaskFilterDto) {
        const { status, search } = getTaskFilterDto;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) ||
                task.description.includes(search)
            );
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);
        if(!found){
            throw new NotFoundException(`Task ID ${id} not found!`);
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {

        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string) {
        const found = this.getTaskById(id);
        const newArray = this.tasks.filter(task => task.id !== found.id);
        this.tasks = newArray;
        return 'Task Deleted';
    }
}
