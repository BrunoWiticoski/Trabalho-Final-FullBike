// pessoas-cadastro.component.ts

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PessoaInterface } from '../../types/pessoas.interface';
import { PessoaService } from '../../services/pessoas.service';
import { GeneroEnum } from 'src/app/bicicleta/types/genero.enum'; // Verifique o caminho correto para o enum

@Component({
  selector: 'app-pessoas-cadastro',
  templateUrl: './pessoas-cadastro.component.html',
  styleUrls: ['./pessoas-cadastro.component.scss'],
})
export class PessoasCadastroComponent implements OnInit {
  pessoaId: string | null;
  pessoasForm: FormGroup;
  generoEnum = GeneroEnum; // Certifique-se de atribuir o enum de gênero corretamente

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private pessoaService: PessoaService,
    private router: Router
  ) {
    this.pessoaId = null;
    this.pessoasForm = this.createForm();
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.pessoaId = id;
      this.pessoaService.getPessoa(this.pessoaId).subscribe((pessoa) => {
        this.pessoasForm = this.createForm(pessoa);
      });
    }
  }

  private createForm(pessoa?: PessoaInterface): FormGroup {
    return new FormGroup({
      nome: new FormControl(pessoa?.nome || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      cpf: new FormControl(pessoa?.cpf || '', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      dataNascimento: new FormControl(
        pessoa?.data_nascimento ? new Date(pessoa.data_nascimento).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10),
        [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]
      ),
      generos: new FormControl(
        pessoa?.generos || GeneroEnum.FEMININO, // Defina um valor padrão ou utilize o valor recebido
        Validators.required
      ),
      telefone: new FormControl(pessoa?.telefone || '', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      cidade: new FormControl(pessoa?.cidade || '', [
        Validators.required,
      ])
    });
  }

  salvar() {
    if (this.pessoasForm.invalid) {
      this.exibirToastErro('Por favor, preencha corretamente todos os campos do formulário.');
      return;
    }
  
    const pessoa: PessoaInterface = {
      ...this.pessoasForm.value,
      id: this.pessoaId || undefined,
      data_nascimento: this.pessoasForm.value.dataNascimento,
      generos: this.pessoasForm.value.generos || GeneroEnum.FEMININO, // Garantir um valor padrão se necessário
    };
  
    this.pessoaService.salvar(pessoa).subscribe(
      () => {
        this.router.navigate(['pessoas']);
      },
      (erro) => {
        console.error('Erro ao salvar:', erro);
        if (erro.error && erro.error.message) {
          this.exibirToastErro(erro.error.message);
        } else {
          this.exibirToastErro('Não foi possível salvar. Por favor, tente novamente mais tarde.');
        }
      }
    );
  }

  private async exibirToastErro(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 5000,
      keyboardClose: true,
      color: 'danger',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  get nome() {
    return this.pessoasForm.get('nome');
  }
}
